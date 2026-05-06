package edu.cit.basinillo.portkey.shared;

import edu.cit.basinillo.portkey.shared.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Centralized error handling — every exception maps to the standard ApiResponse shape.
 * Error codes follow the SDD convention (AUTH-001, VALID-001, DB-001, etc.).
 * Part of the shared kernel — applies to all feature modules.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest()
                .body(ApiResponse.error("VALID-001", "Validation failed", fieldErrors));
    }

    @ExceptionHandler(edu.cit.basinillo.portkey.shared.DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicate(edu.cit.basinillo.portkey.shared.DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.error("DB-002", "Duplicate entry", ex.getMessage()));
    }

    @ExceptionHandler(edu.cit.basinillo.portkey.shared.ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(edu.cit.basinillo.portkey.shared.ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("DB-001", "Resource not found", ex.getMessage()));
    }

    @ExceptionHandler(edu.cit.basinillo.portkey.shared.UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(edu.cit.basinillo.portkey.shared.UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("AUTH-001", "Authentication failed", ex.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("AUTH-001", "Invalid credentials", "Email or password is incorrect"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("AUTH-003", "Insufficient permissions", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("SYSTEM-001", "Internal server error", ex.getMessage()));
    }
}
