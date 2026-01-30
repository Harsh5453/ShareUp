package com.shareup.rental.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RatingRequestDTO {

    private String rentalId;
    private String toUserId;
    private int stars;
    private String review;

    // getters & setters
}
