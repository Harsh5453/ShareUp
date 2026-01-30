package com.shareup.rental.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BorrowRequestDTO {
    private String itemId;
    private Long ownerId;
}
