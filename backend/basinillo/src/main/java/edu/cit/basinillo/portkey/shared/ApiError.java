package edu.cit.basinillo.portkey.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard error shape for ApiResponse wrapper.
 * Part of the shared kernel.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    private String code;
    private String message;
    private Object details;
}
