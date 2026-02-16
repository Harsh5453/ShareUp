package com.shareup.rental.service;

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

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final EmailService emailService;
    private final RatingRepository ratingRepository;
    private final RestTemplate restTemplate;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    @Value("${item.service.url}")
    private String itemServiceUrl;

    private final String uploadDir = "uploads/returns";

    public RentalService(RentalRepository rentalRepository,
                         EmailService emailService,
                         RatingRepository ratingRepository,
                         RestTemplate restTemplate) {
        this.rentalRepository = rentalRepository;
        this.emailService = emailService;
        this.ratingRepository = ratingRepository;
        this.restTemplate = restTemplate;
    }

    // ================= BORROW REQUEST =================

    public RentalRequest createBorrowRequest(Long borrowerId,
                                             String borrowerPhone,
                                             String borrowerAddress,
                                             BorrowRequestDTO dto) {

        RentalRequest request = new RentalRequest();
        request.setItemId(dto.getItemId());
        request.setOwnerId(dto.getOwnerId());
        request.setBorrowerId(borrowerId);
        request.setBorrowerPhone(borrowerPhone);
        request.setBorrowerAddress(borrowerAddress);
        request.setStatus(RentalStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        RentalRequest saved = rentalRepository.save(request);

        // ✅ Email wrapped safely
        try {
            sendOwnerNewRequestEmail(saved);
        } catch (Exception e) {
            System.out.println("Email failed (ignored): " + e.getMessage());
        }

        return saved;
    }

    // ================= APPROVE REQUEST =================

    public RentalRequest approveRequest(String rentalId,
                                        Long ownerId,
                                        String ownerPhone,
                                        String ignoredPickupAddress) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        ItemResponse item = null;
        try {
            item = restTemplate.getForObject(
                    itemServiceUrl + "/api/items/" + req.getItemId(),
                    ItemResponse.class
            );
        } catch (Exception e) {
            System.out.println("Item service failed: " + e.getMessage());
        }

        if (item == null || item.getPickupAddress() == null) {
            throw new RuntimeException("Pickup address not found");
        }

        req.setPickupAddress(item.getPickupAddress());
        req.setOwnerPhone(ownerPhone);
        req.setStatus(RentalStatus.APPROVED);
        req.setApprovedAt(LocalDateTime.now());

        rentalRepository.save(req);

        rejectOtherRequests(req);
        syncItemRented(req.getItemId());

        try {
            sendBorrowerApprovalEmail(req, item);
        } catch (Exception e) {
            System.out.println("Approval email failed: " + e.getMessage());
        }

        return req;
    }

    // ================= REJECT =================

    public RentalRequest rejectRequest(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.REJECTED);
        return rentalRepository.save(req);
    }

    // ================= RETURN REQUEST =================

    public RentalRequest requestReturn(String rentalId,
                                       Long borrowerId,
                                       MultipartFile image) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!borrowerId.equals(req.getBorrowerId())) {
            throw new RuntimeException("Unauthorized");
        }

        String filename = saveImage(image);

        req.setReturnImageUrl(filename);
        req.setReturnRequestedAt(LocalDateTime.now());
        req.setStatus(RentalStatus.RETURN_REQUESTED);

        return rentalRepository.save(req);
    }

    // ================= APPROVE RETURN =================

    public RentalRequest approveReturn(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.RETURN_APPROVED);
        req.setReturnApprovedAt(LocalDateTime.now());

        rentalRepository.save(req);
        syncItemAvailable(req.getItemId());

        return req;
    }

    // ================= EMAIL HELPERS =================

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

        } catch (Exception e) {
            System.out.println("Owner email failed: " + e.getMessage());
        }
    }

    private void sendBorrowerApprovalEmail(RentalRequest req, ItemResponse item) {

        try {
            Map user = restTemplate.getForObject(
                    authServiceUrl + "/api/users/" + req.getBorrowerId(),
                    Map.class
            );

            if (user == null) return;

            emailService.sendEmail(
                    (String) user.get("email"),
                    "Rental Approved - ShareUp",
                    "Pickup Address: " + req.getPickupAddress()
            );

        } catch (Exception e) {
            System.out.println("Borrower email failed: " + e.getMessage());
        }
    }

    // ================= UTILITIES =================

    private void rejectOtherRequests(RentalRequest req) {
        List<RentalRequest> others =
                rentalRepository.findByItemIdAndStatus(req.getItemId(), RentalStatus.PENDING);

        for (RentalRequest r : others) {
            if (!r.getId().equals(req.getId())) {
                r.setStatus(RentalStatus.REJECTED);
                rentalRepository.save(r);
            }
        }
    }

    private void syncItemRented(String itemId) {
        try {
            restTemplate.put(itemServiceUrl + "/api/items/" + itemId + "/rent", null);
        } catch (Exception e) {
            System.out.println("Item rent sync failed: " + e.getMessage());
        }
    }

    private void syncItemAvailable(String itemId) {
        try {
            restTemplate.put(itemServiceUrl + "/api/items/" + itemId + "/available", null);
        } catch (Exception e) {
            System.out.println("Item available sync failed: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile file) {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir).resolve(filename);
            Files.write(path, file.getBytes());
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    public List<RentalRequest> getRequestsForOwner(Long ownerId) {
        return rentalRepository.findByOwnerId(ownerId);
    }

    public List<RentalRequest> getRentalsForBorrower(Long borrowerId) {
        return rentalRepository.findByBorrowerId(borrowerId);
    }

    public List<RentalRequest> getPendingReturnsForOwner(Long ownerId) {
        return rentalRepository.findByOwnerIdAndStatus(ownerId, RentalStatus.RETURN_REQUESTED);
    }

    public Path getReturnImagePath(String rentalId) {
        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
        return Paths.get(uploadDir).resolve(req.getReturnImageUrl());
    }

    public List<Rating> getRatingsForUser(Long userId) {
        return ratingRepository.findByToUserId(userId.toString());
    }
}
