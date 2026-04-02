package com.shareup.rental.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ─── Handles RuntimeException from RentalService ───────────────────────────

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage();

        if (msg == null) {
            log.error("Unexpected null RuntimeException", ex);
            return ResponseEntity.status(500)
                    .body(new ErrorResponse(500, "Internal server error"));
        }

        // 404 — not found
        if (msg.toLowerCase().contains("not found")) {
            log.warn("Resource not found: {}", msg);
            return ResponseEntity.status(404)
                    .body(new ErrorResponse(404, msg));
        }

        // 403 — unauthorized ownership check
        if (msg.equalsIgnoreCase("Unauthorized")) {
            log.warn("Unauthorized access attempt");
            return ResponseEntity.status(403)
                    .body(new ErrorResponse(403, "You are not authorized to perform this action"));
        }

        // 400 — business logic violations
        if (msg.toLowerCase().contains("already") ||
            msg.toLowerCase().contains("cannot") ||
            msg.toLowerCase().contains("invalid")) {
            log.warn("Bad request: {}", msg);
            return ResponseEntity.status(400)
                    .body(new ErrorResponse(400, msg));
        }

        // 500 — everything else (don't leak internal details)
        log.error("Unhandled exception: {}", msg, ex);
        return ResponseEntity.status(500)
                .body(new ErrorResponse(500, "Something went wrong. Please try again."));
    }

    // ─── Handles @Valid validation failures ────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(err ->
                fieldErrors.put(err.getField(), err.getDefaultMessage())
        );

        log.warn("Validation failed: {}", fieldErrors);

        return ResponseEntity.status(400)
                .body(new ErrorResponse(400, "Validation failed", fieldErrors));
    }

    // ─── Error response shape ──────────────────────────────────────────────────

    public record ErrorResponse(
            int status,
            String message,
            Object details,
            LocalDateTime timestamp
    ) {
        // Convenience constructors
        public ErrorResponse(int status, String message) {
            this(status, message, null, LocalDateTime.now());
        }
        public ErrorResponse(int status, String message, Object details) {
            this(status, message, details, LocalDateTime.now());
        }
    }
}