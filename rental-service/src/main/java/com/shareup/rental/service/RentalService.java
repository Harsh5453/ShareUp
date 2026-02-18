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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class RentalService {

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

        // 🔥 Fetch borrower details from auth-service
        Map user = null;
        try {
            user = restTemplate.getForObject(
                    authServiceUrl + "/api/users/" + borrowerId,
                    Map.class
            );
        } catch (Exception e) {
            System.out.println("Auth service failed: " + e.getMessage());
        }

        RentalRequest request = new RentalRequest();
        request.setItemId(dto.getItemId());
        request.setOwnerId(dto.getOwnerId());
        request.setBorrowerId(borrowerId);

        if (user != null) {
            request.setBorrowerEmail((String) user.get("email"));
            request.setBorrowerPhone((String) user.get("phone"));
            request.setBorrowerAddress((String) user.get("address"));
        }

        request.setStatus(RentalStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        RentalRequest saved = rentalRepository.save(request);

        try {
            sendOwnerNewRequestEmail(saved);
        } catch (Exception ignored) {}

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
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Fetch item details
        ItemResponse item = null;
        try {
            item = restTemplate.getForObject(
                    itemServiceUrl + "/api/items/" + req.getItemId(),
                    ItemResponse.class
            );
        } catch (Exception e) {
            System.out.println("Item service failed: " + e.getMessage());
        }

        // Fetch owner details
        Map owner = null;
        try {
            owner = restTemplate.getForObject(
                    authServiceUrl + "/api/users/" + ownerId,
                    Map.class
            );
        } catch (Exception e) {
            System.out.println("Auth service failed: " + e.getMessage());
        }

        if (item != null) {
            req.setPickupAddress(item.getPickupAddress());
        }

        if (owner != null) {
            req.setOwnerPhone((String) owner.get("phone"));
        }

        req.setStatus(RentalStatus.APPROVED);
        req.setApprovedAt(LocalDateTime.now());

        return rentalRepository.save(req);
    }

    // ============================================================
    // ================= REJECT REQUEST ===========================
    // ============================================================

    public RentalRequest rejectRequest(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.REJECTED);
        return rentalRepository.save(req);
    }

    // ============================================================
    // ================= RETURN REQUEST ===========================
    // ============================================================

    public RentalRequest requestReturn(String rentalId,
                                       Long borrowerId,
                                       MultipartFile image) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!borrowerId.equals(req.getBorrowerId())) {
            throw new RuntimeException("Unauthorized");
        }

        String imageUrl = uploadToCloudinary(image);

        req.setReturnImageUrl(imageUrl);
        req.setReturnRequestedAt(LocalDateTime.now());
        req.setStatus(RentalStatus.RETURN_REQUESTED);

        return rentalRepository.save(req);
    }

    // ============================================================
    // ================= APPROVE RETURN ===========================
    // ============================================================

    public RentalRequest approveReturn(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.RETURN_APPROVED);
        req.setReturnApprovedAt(LocalDateTime.now());

        return rentalRepository.save(req);
    }

    // ============================================================
    // ================= CLOUDINARY UPLOAD ========================
    // ============================================================

    private String uploadToCloudinary(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "shareup/returns")
            );

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed", e);
        }
    }

    // ============================================================
    // ================= EMAIL ===================================
    // ============================================================

    private void sendOwnerNewRequestEmail(RentalRequest req) {
        try {
            Map user = restTemplate.getForObject(
                    authServiceUrl + "/api/users/" + req.getOwnerId(),
                    Map.class
            );

            ItemResponse item = restTemplate.getForObject(
                    itemServiceUrl + "/api/items/" + req.getItemId(),
                    ItemResponse.class
            );

            if (user == null || item == null) return;

            emailService.sendEmail(
                    (String) user.get("email"),
                    "New Rental Request - ShareUp",
                    "Item: " + item.getName()
            );

        } catch (Exception ignored) {}
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
        return rentalRepository.findByOwnerIdAndStatus(
                ownerId,
                RentalStatus.RETURN_REQUESTED
        );
    }

    public RentalRequest getById(String id) {
        return rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    public List<Rating> getRatingsForUser(Long userId) {
        return ratingRepository.findByToUserId(userId.toString());
    }
                }
