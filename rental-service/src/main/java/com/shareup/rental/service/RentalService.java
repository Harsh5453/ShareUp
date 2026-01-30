package com.shareup.rental.service;

import com.shareup.rental.dto.BorrowRequestDTO;
import com.shareup.rental.dto.ItemResponse;
import com.shareup.rental.dto.RatingRequestDTO;
import com.shareup.rental.model.Rating;
import com.shareup.rental.model.RentalRequest;
import com.shareup.rental.model.RentalStatus;
import com.shareup.rental.repository.RatingRepository;
import com.shareup.rental.repository.RentalRepository;
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

    private final String uploadDir = "uploads/returns";

    private final String AUTH_SERVICE_URL = "http://localhost:8081/api/users/";
    private final String ITEM_SERVICE_URL = "http://localhost:8082/api/items/";

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

        sendOwnerNewRequestEmail(saved);

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

        ItemResponse item = restTemplate.getForObject(
                ITEM_SERVICE_URL + req.getItemId(),
                ItemResponse.class
        );

        if (item == null || item.getPickupAddress() == null) {
            throw new RuntimeException("Pickup address not found in item");
        }

        req.setPickupAddress(item.getPickupAddress());
        req.setOwnerPhone(ownerPhone);
        req.setStatus(RentalStatus.APPROVED);
        req.setApprovedAt(LocalDateTime.now());

        rentalRepository.save(req);

        rejectOtherRequests(req);

        syncItemRented(req.getItemId());

        sendBorrowerApprovalEmail(req, item);

        return req;
    }
    // =================REJECT REQUEST ======================
    public RentalRequest rejectRequest(String rentalId, Long ownerId) {

        RentalRequest req = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));

        if (!ownerId.equals(req.getOwnerId())) {
            throw new RuntimeException("Unauthorized");
        }

        req.setStatus(RentalStatus.REJECTED);
        RentalRequest saved = rentalRepository.save(req);

        sendBorrowerRejectEmail(saved);

        return saved;
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

        RentalRequest saved = rentalRepository.save(req);

        sendOwnerReturnRequestEmail(saved);

        return saved;
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

        sendBorrowerReturnApprovedEmail(req);

        return req;
    }

    // ================= EMAIL HELPERS =================

    private void sendOwnerNewRequestEmail(RentalRequest req) {

        Map user = restTemplate.getForObject(AUTH_SERVICE_URL + req.getOwnerId(), Map.class);
        ItemResponse item = restTemplate.getForObject(ITEM_SERVICE_URL + req.getItemId(), ItemResponse.class);

        if (user == null || item == null) return;

        String body =
                "You have received a new rental request.\n\n" +
                "Item: " + item.getName() + " (Item ID: " + item.getId() + ")";

        emailService.sendEmail((String) user.get("email"),
                "New Rental Request - ShareUp",
                body);
    }

    private void sendBorrowerApprovalEmail(RentalRequest req, ItemResponse item) {

        Map user = restTemplate.getForObject(AUTH_SERVICE_URL + req.getBorrowerId(), Map.class);

        if (user == null) return;

        String body =
                "Your rental request has been approved.\n\n" +
                "Item: " + item.getName() + " (Item ID: " + item.getId() + ")\n" +
                "Pickup Address: " + req.getPickupAddress();

        emailService.sendEmail((String) user.get("email"),
                "Rental Approved - ShareUp",
                body);
    }

    private void sendBorrowerRejectEmail(RentalRequest req) {

        Map user = restTemplate.getForObject(AUTH_SERVICE_URL + req.getBorrowerId(), Map.class);
        ItemResponse item = restTemplate.getForObject(ITEM_SERVICE_URL + req.getItemId(), ItemResponse.class);

        if (user == null || item == null) return;

        String body =
                "Your rental request for the following item has been rejected by the owner:\n\n" +
                "Item: " + item.getName() + " (Item ID: " + item.getId() + ")\n\n" +
                "You can browse other available items on ShareUp.\n\n" ;

        emailService.sendEmail(
                (String) user.get("email"),
                "Rental Request Rejected – ShareUp",
                body
        );
    }

    private void sendOwnerReturnRequestEmail(RentalRequest req) {

        Map user = restTemplate.getForObject(AUTH_SERVICE_URL + req.getOwnerId(), Map.class);

        if (user == null) return;

        String body =
                "Borrower has requested to return the item.\n\n" +
                "Item ID: " + req.getItemId();

        emailService.sendEmail((String) user.get("email"),
                "Return Requested - ShareUp",
                body);
    }

    private void sendBorrowerReturnApprovedEmail(RentalRequest req) {

        Map user = restTemplate.getForObject(AUTH_SERVICE_URL + req.getBorrowerId(), Map.class);

        if (user == null) return;

        String body =
                "Your return request has been approved successfully.\n\n" +
                "Item ID: " + req.getItemId();

        emailService.sendEmail((String) user.get("email"),
                "Return Approved - ShareUp",
                body);
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
            restTemplate.put(ITEM_SERVICE_URL + itemId + "/rent", null);
        } catch (Exception ignored) {}
    }

    private void syncItemAvailable(String itemId) {
        try {
            restTemplate.put(ITEM_SERVICE_URL + itemId + "/available", null);
        } catch (Exception ignored) {}
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

    // ================= DASHBOARD & RATINGS  =================

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
