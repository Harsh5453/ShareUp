package com.shareup.rental.controller;

import com.shareup.rental.dto.BorrowRequestDTO;
import com.shareup.rental.model.RentalRequest;
import com.shareup.rental.security.UserContext;
import com.shareup.rental.service.RentalService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@Validated
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    private Long userId(Authentication auth) {
        return Long.parseLong(auth.getPrincipal().toString());
    }

    private UserContext userContext(Authentication auth) {
        if (auth instanceof UsernamePasswordAuthenticationToken token
                && token.getDetails() instanceof UserContext ctx) {
            return ctx;
        }
        return new UserContext(userId(auth), null, null);
    }

    // ================= BORROW REQUEST =================

    @PostMapping("/request")
    public ResponseEntity<?> borrow(
            @Valid @RequestBody BorrowRequestDTO dto,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");

        UserContext ctx = userContext(authentication);

        RentalRequest result = rentalService.createBorrowRequest(
                ctx.getUserId(),
                ctx.getEmail(),
                ctx.getPhone(),
                dto
        );

        return ResponseEntity.ok(result);
    }

    // ================= APPROVE RENTAL =================

    @PutMapping("/approve/{id}")
    public ResponseEntity<RentalRequest> approveRental(
            @PathVariable String id,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(
                rentalService.approveRequest(id, userId(authentication), null, null)
        );
    }

    // ================= REJECT RENTAL =================

    @PutMapping("/reject/{id}")
    public ResponseEntity<RentalRequest> rejectRental(
            @PathVariable String id,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(
                rentalService.rejectRequest(id, userId(authentication))
        );
    }

    // ================= RETURN REQUEST =================

    @PostMapping("/{id}/return")
    public ResponseEntity<RentalRequest> returnItem(
            @PathVariable String id,
            @RequestParam("image") MultipartFile image,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(
                rentalService.requestReturn(id, userId(authentication), image)
        );
    }

    // ================= APPROVE RETURN =================

    @PutMapping("/approve-return/{id}")
    public ResponseEntity<RentalRequest> approveReturn(
            @PathVariable String id,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(
                rentalService.approveReturn(id, userId(authentication))
        );
    }

    // ================= CANCEL RENTAL (borrower) =================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<RentalRequest> cancelRental(
            @PathVariable String id,
            Authentication authentication) {

        if (authentication == null) return ResponseEntity.status(401).build();

        return ResponseEntity.ok(
                rentalService.cancelRequest(id, userId(authentication))
        );
    }

    // ================= OWNER DASHBOARD =================

    @GetMapping("/owner")
    public ResponseEntity<List<RentalRequest>> ownerRequests(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(rentalService.getRequestsForOwner(userId(authentication)));
    }

    // ================= BORROWER DASHBOARD =================

    @GetMapping("/me")
    public ResponseEntity<List<RentalRequest>> myRentals(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(rentalService.getRentalsForBorrower(userId(authentication)));
    }

    // ================= OWNER RETURN REQUESTS =================

    @GetMapping("/owner/returns")
    public ResponseEntity<List<RentalRequest>> pendingReturns(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(rentalService.getPendingReturnsForOwner(userId(authentication)));
    }

    // ================= RETURN IMAGE =================

    @GetMapping("/{id}/return-image")
    public ResponseEntity<?> getReturnImage(@PathVariable String id) {
        RentalRequest rental = rentalService.getById(id);
        if (rental.getReturnImageUrl() == null) return ResponseEntity.notFound().build();
        return ResponseEntity.status(302).header("Location", rental.getReturnImageUrl()).build();
    }
    // ================ Health Endpoint =============================
    @GetMapping("/health")
    public String health() {
    return "OK";
}
}
