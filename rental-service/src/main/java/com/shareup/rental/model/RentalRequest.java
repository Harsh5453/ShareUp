package com.shareup.rental.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "rentals")
public class RentalRequest {

    @Id
    private String id;

    // Item info
    private String itemId;

    // User IDs (JWT based)
    private Long borrowerId;
    private Long ownerId;

    // Contact info
    private String borrowerEmail;   
    private String borrowerPhone;
    private String borrowerAddress;

    private String ownerPhone;
    private String pickupAddress;

    // Status
    private RentalStatus status;

    // Return flow
    private String returnImageUrl;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime returnRequestedAt;
    private LocalDateTime returnApprovedAt;

    // Feedback
    private Integer rating;
    private String feedback;
}
