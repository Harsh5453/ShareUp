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

        try {
            sendOwnerNewRequestEmail(saved);
        } catch (Exception ignored) {}

        return saved;
    }

    // ================= RETURN REQUEST (Cloudinary Upload) =================

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

    // ================= CLOUDINARY UPLOAD =================

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

        } catch (Exception ignored) {}
    }

    // ================= DASHBOARD =================

    public List<RentalRequest> getRequestsForOwner(Long ownerId) {
        return rentalRepository.findByOwnerId(ownerId);
    }

    public List<RentalRequest> getRentalsForBorrower(Long borrowerId) {
        return rentalRepository.findByBorrowerId(borrowerId);
    }

    public List<Rating> getRatingsForUser(Long userId) {
        return ratingRepository.findByToUserId(userId.toString());
    }
}
