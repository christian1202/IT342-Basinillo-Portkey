package edu.cit.basinillo.portkey.shared;

/**
 * Thrown when attempting to create a resource that already exists.
 * Mapped to HTTP 409 in GlobalExceptionHandler.
 * Part of the shared kernel.
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
