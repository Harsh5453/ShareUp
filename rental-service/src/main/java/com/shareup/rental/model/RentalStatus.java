package com.shareup.rental.model;

public enum RentalStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED,          //  borrower cancels a PENDING request
    RETURN_REQUESTED,
    RETURN_APPROVED
}