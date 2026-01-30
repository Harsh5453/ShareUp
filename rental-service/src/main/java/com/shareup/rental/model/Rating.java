package com.shareup.rental.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ratings")
public class Rating {

    @Id
    private String id;

    private String rentalId;
    private String fromUserId;
    private String toUserId;

    private int stars;      // 1 to 10
    private String review;

    private LocalDateTime createdAt;

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRentalId() { return rentalId; }
    public void setRentalId(String rentalId) { this.rentalId = rentalId; }

    public String getFromUserId() { return fromUserId; }
    public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }

    public String getToUserId() { return toUserId; }
    public void setToUserId(String toUserId) { this.toUserId = toUserId; }

    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
