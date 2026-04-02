package com.shareup.rental.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.shareup.rental.dto.BorrowRequestDTO;
import com.shareup.rental.dto.ItemResponse;
import com.shareup.rental.model.Rating;
import com.shareup.rental.model.RentalRequest;
import com.shareup.rental.model.RentalStatus;
import com.shareup.rental.repository.RatingRepository;
import com.shareup.rental.repository.RentalRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class RentalService {

    private static final Logger log = LoggerFactory.getLogger(RentalService.class);

    private final RentalRepository rentalRepository;
    private final EmailService emailService;
    private final RatingRepository ratingRepository;
    private final RestTemplate restTemplate;
    private final Cloudinary cloudinary;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    @Value("${item.service.url}")
    private String itemServiceUrl;

    public RentalService(RentalRepository rentalRepository,
                         EmailService emailService,
                         RatingRepository ratingRepository,
                         RestTemplate restTemplate,
                         Cloudinary cloudinary) {
        this.rentalRepository = rentalRepository;
        this.emailService = emailService;
        this.ratingRepository = ratingRepository;
        this.restTemplate = restTemplate;
        this.cloudinary = cloudinary;
    }

    // ============================================================
    // ================= BORROW REQUEST ===========================
    // ============================================================

    public RentalRequest createBorrowRequest(Long borrowerId,
                                             String ignoredPhone,
                                             String ignoredAddress,
                                             BorrowRequestDTO dto) {

        // Validate dates
        if (dto.getEndDate() != null && dto.getStartDate() != null
                && !dto.getEndDate().isAfter(dto.getStartDate())) {
            throw new RuntimeException("endDate must be after startDate");
        }

        Map user = fetchUser(borrowerId);

        RentalRequest request = new RentalRequest();
        request.setItemId(dto.getItemId());
        request.setOwnerId(dto.getOwnerId());
        request.setBorrowerId(borrowerId);
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());

        if (user != null) {
            request.setBorrowerEmail((String) user.get("email"));
            request.setBorrowerPhone((String) user.get("phone"));
            request.setBorrowerAddress((String) user.get("address"));
        }

        request.setStatus(RentalStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        RentalRequest saved = rentalRepository.save(request);
        log.info("Borrow request created id={} itemId={} borrowerId={}", saved.getId(), dto.getItemId(), borrowerId);

        try {
            sendOwnerNewRequestEmail(saved);
        } catch (Exception e) {
            log.warn("Failed to send new-request email rentalId={}: {}", saved.getId(), e.getMessage());
        }

        return saved;
    }

    // ============================================================
    // ================= APPROVE REQUEST ==========================
    // ============================================================

    public RentalRequest approveRequest(String rentalId,
                                        Long ownerId,
                                        String ignoredPhone,
                                        String ignoredPickupAddress) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + rentalId));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        ItemResponse item = fetchItem(req.getItemId());
        Map owner = fetchUser(ownerId);

        if (item != null)  req.setPickupAddress(item.getPickupAddress());
        if (owner != null) req.setOwnerPhone((String) owner.get("phone"));

        req.setStatus(RentalStatus.APPROVED);
        req.setApprovedAt(LocalDateTime.now());

        RentalRequest approved = rentalRepository.save(req);
        // Update item status to RENTED
        try {
            restTemplate.put(
            itemServiceUrl + "/api/items/" + req.getItemId() + "/rented",
            null
        );
        } 
        catch (Exception e) {
            log.warn("Failed to update item status to RENTED for itemId={}", req.getItemId());
        }

        log.info("Rental approved id={} ownerId={}", rentalId, ownerId);

        // Auto-reject all other PENDING requests for this item
        List<RentalRequest> otherPending = rentalRepository
                .findByItemIdAndStatus(req.getItemId(), RentalStatus.PENDING);

        for (RentalRequest other : otherPending) {
            if (!other.getId().equals(approved.getId())) {
                other.setStatus(RentalStatus.REJECTED);
                rentalRepository.save(other);
                log.info("Auto-rejected competing request id={} for itemId={}", other.getId(), req.getItemId());
            }
        }

        // Email borrower — approved
        try {
            sendBorrowerApprovedEmail(approved, item);
        } catch (Exception e) {
            log.warn("Failed to send approval email rentalId={}: {}", rentalId, e.getMessage());
        }

        return approved;
    }

    // ============================================================
    // ================= REJECT REQUEST ===========================
    // ============================================================

    public RentalRequest rejectRequest(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + rentalId));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.REJECTED);
        RentalRequest rejected = rentalRepository.save(req);
        log.info("Rental rejected id={} ownerId={}", rentalId, ownerId);

        // Email borrower — rejected
        try {
            sendBorrowerRejectedEmail(rejected);
        } catch (Exception e) {
            log.warn("Failed to send rejection email rentalId={}: {}", rentalId, e.getMessage());
        }

        return rejected;
    }

    // ============================================================
    // ================= CANCEL REQUEST (borrower) ================
    // ============================================================

    public RentalRequest cancelRequest(String rentalId, Long borrowerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + rentalId));

        if (!borrowerId.equals(req.getBorrowerId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (req.getStatus() != RentalStatus.PENDING) {
            throw new RuntimeException("Cannot cancel a rental that is already " + req.getStatus());
        }

        req.setStatus(RentalStatus.CANCELLED);
        req.setCancelledAt(LocalDateTime.now());

        log.info("Rental cancelled id={} borrowerId={}", rentalId, borrowerId);
        return rentalRepository.save(req);
    }

    // ============================================================
    // ================= RETURN REQUEST ===========================
    // ============================================================

    public RentalRequest requestReturn(String rentalId,
                                       Long borrowerId,
                                       MultipartFile image) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + rentalId));

        if (!borrowerId.equals(req.getBorrowerId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (req.getStatus() != RentalStatus.APPROVED) {
            throw new RuntimeException("Cannot return a rental that is not APPROVED");
        }

        String imageUrl = uploadToCloudinary(image);
        req.setReturnImageUrl(imageUrl);
        req.setReturnRequestedAt(LocalDateTime.now());
        req.setStatus(RentalStatus.RETURN_REQUESTED);

        log.info("Return requested id={} borrowerId={}", rentalId, borrowerId);
        return rentalRepository.save(req);
    }

    // ============================================================
    // ================= APPROVE RETURN ===========================
    // ============================================================

    public RentalRequest approveReturn(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + rentalId));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.RETURN_APPROVED);
        req.setReturnApprovedAt(LocalDateTime.now());

        log.info("Return approved id={} ownerId={}", rentalId, ownerId);
        RentalRequest saved = rentalRepository.save(req);

        // Update item status back to AVAILABLE
        try {
            restTemplate.put(
            itemServiceUrl + "/api/items/" + req.getItemId() + "/available",
            null
            );
        } 
        catch(Exception e) {
             log.warn("Failed to update item status to AVAILABLE for itemId={}", req.getItemId());
        }

return saved;
    }

    // ============================================================
    // ================= INTERNAL HELPERS =========================
    // ============================================================

    private Map fetchUser(Long userId) {
        try {
            return restTemplate.getForObject(
                    authServiceUrl + "/api/users/" + userId, Map.class);
        } catch (Exception e) {
            log.warn("Auth service unreachable userId={}: {}", userId, e.getMessage());
            return null;
        }
    }

    private ItemResponse fetchItem(String itemId) {
        try {
            return restTemplate.getForObject(
                    itemServiceUrl + "/api/items/" + itemId, ItemResponse.class);
        } catch (Exception e) {
            log.warn("Item service unreachable itemId={}: {}", itemId, e.getMessage());
            return null;
        }
    }

    // ============================================================
    // ================= CLOUDINARY ===============================
    // ============================================================

    private String uploadToCloudinary(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "shareup/returns")
            );
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Image upload failed", e);
        }
    }

    // ============================================================
    // ================= EMAILS ===================================
    // ============================================================

    private void sendOwnerNewRequestEmail(RentalRequest req) {
        Map owner = fetchUser(req.getOwnerId());
        ItemResponse item = fetchItem(req.getItemId());
        if (owner == null || item == null) return;

        String body = String.format(
            "Hi,\n\nYou have a new rental request on ShareUp!\n\n" +
            "Item     : %s\n" +
            "Borrower : %s\n" +
            "Dates    : %s to %s\n\n" +
            "Please log in to approve or reject this request.",
            item.getName(),
            req.getBorrowerEmail() != null ? req.getBorrowerEmail() : "—",
            req.getStartDate() != null ? req.getStartDate() : "—",
            req.getEndDate()   != null ? req.getEndDate()   : "—"
        );

        emailService.sendEmail((String) owner.get("email"), "New Rental Request — ShareUp", body);
    }

    private void sendBorrowerApprovedEmail(RentalRequest req, ItemResponse item) {
        if (req.getBorrowerEmail() == null) return;
        String itemName = item != null ? item.getName() : "your item";

        String body = String.format(
            "Hi,\n\nGreat news! Your rental request has been approved.\n\n" +
            "Item           : %s\n" +
            "Dates          : %s to %s\n" +
            "Pickup Address : %s\n" +
            "Owner Phone    : %s\n\n" +
            "Please coordinate with the owner for pickup.",
            itemName,
            req.getStartDate() != null ? req.getStartDate() : "—",
            req.getEndDate()   != null ? req.getEndDate()   : "—",
            req.getPickupAddress() != null ? req.getPickupAddress() : "—",
            req.getOwnerPhone()    != null ? req.getOwnerPhone()    : "—"
        );

        emailService.sendEmail(req.getBorrowerEmail(), "Rental Approved — ShareUp", body);
    }

    private void sendBorrowerRejectedEmail(RentalRequest req) {
        if (req.getBorrowerEmail() == null) return;

        String body = "Hi,\n\nUnfortunately your rental request was not approved by the owner.\n\n" +
                      "Please browse other available items on ShareUp.\n\nWe hope you find what you need!";

        emailService.sendEmail(req.getBorrowerEmail(), "Rental Request Update — ShareUp", body);
    }

    // ============================================================
    // ================= DASHBOARD ================================
    // ============================================================

    public List<RentalRequest> getRequestsForOwner(Long ownerId) {
        return rentalRepository.findByOwnerId(ownerId);
    }

    public List<RentalRequest> getRentalsForBorrower(Long borrowerId) {
        return rentalRepository.findByBorrowerId(borrowerId);
    }

    public List<RentalRequest> getPendingReturnsForOwner(Long ownerId) {
        return rentalRepository.findByOwnerIdAndStatus(ownerId, RentalStatus.RETURN_REQUESTED);
    }

    public RentalRequest getById(String id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + id));
    }

    public List<Rating> getRatingsForUser(Long userId) {
        return ratingRepository.findByToUserId(userId.toString());
    }
}
