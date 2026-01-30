package com.shareup.rental.repository;

import com.shareup.rental.model.RentalRequest;
import com.shareup.rental.model.RentalStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalRepository extends MongoRepository<RentalRequest, String> {

    // Owner dashboard – rental requests
    List<RentalRequest> findByOwnerId(Long ownerId);

    // Borrower dashboard – my rentals
    List<RentalRequest> findByBorrowerId(Long borrowerId);

    // Used when approving one request and rejecting others
    List<RentalRequest> findByItemIdAndStatus(String itemId, RentalStatus status);

    List<RentalRequest> findByOwnerIdAndStatus(Long ownerId, RentalStatus status);
}
