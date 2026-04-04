package com.shareup.rental.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Future;   
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
public class BorrowRequestDTO {

    @NotBlank(message = "itemId is required")
    private String itemId;

    @NotNull(message = "ownerId is required")
    private Long ownerId;

    @NotNull(message = "startDate is required")
    @FutureOrPresent(message = "startDate must be in the future or present")
    private LocalDate startDate;

    @NotNull(message = "endDate is required")
    @Future(message = "endDate must be in the future")
    private LocalDate endDate;
}
