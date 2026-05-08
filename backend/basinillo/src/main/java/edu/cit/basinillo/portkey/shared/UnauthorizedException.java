package edu.cit.basinillo.portkey.shared;

/**
 * Thrown when authentication fails or user is not authorized.
 * Mapped to HTTP 401 in GlobalExceptionHandler.
 * Part of the shared kernel.
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
