package edu.cit.basinillo.portkey.shared;

/**
 * Thrown when a requested resource does not exist.
 * Mapped to HTTP 404 in GlobalExceptionHandler.
 * Part of the shared kernel.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
