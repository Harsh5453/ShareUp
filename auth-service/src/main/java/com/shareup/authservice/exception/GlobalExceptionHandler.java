package com.shareup.authservice.exception;

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

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage();

        if (msg == null) {
            log.error("Unexpected null RuntimeException", ex);
            return ResponseEntity.status(500)
                    .body(new ErrorResponse(500, "Internal server error"));
        }

        if (msg.toLowerCase().contains("not found")) {
            log.warn("Resource not found: {}", msg);
            return ResponseEntity.status(404)
                    .body(new ErrorResponse(404, msg));
        }

        if (msg.toLowerCase().contains("already registered") ||
            msg.toLowerCase().contains("already exists")) {
            log.warn("Conflict: {}", msg);
            return ResponseEntity.status(409)
                    .body(new ErrorResponse(409, msg));
        }

        if (msg.toLowerCase().contains("bad credentials") ||
            msg.toLowerCase().contains("invalid password")) {
            return ResponseEntity.status(401)
                    .body(new ErrorResponse(401, "Invalid email or password"));
        }

        log.error("Unhandled exception: {}", msg, ex);
        return ResponseEntity.status(500)
                .body(new ErrorResponse(500, "Something went wrong. Please try again."));
    }

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

    public record ErrorResponse(
            int status,
            String message,
            Object details,
            LocalDateTime timestamp
    ) {
        public ErrorResponse(int status, String message) {
            this(status, message, null, LocalDateTime.now());
        }
        public ErrorResponse(int status, String message, Object details) {
            this(status, message, details, LocalDateTime.now());
        }
    }
}