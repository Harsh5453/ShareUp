package com.shareup.rental.repository;

import com.shareup.rental.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends MongoRepository<Rating, String> {

    Optional<Rating> findByRentalIdAndFromUserId(String rentalId, String fromUserId);
    List<Rating> findByToUserId(String toUserId);
}
