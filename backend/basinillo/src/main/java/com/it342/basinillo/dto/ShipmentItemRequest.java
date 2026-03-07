package com.it342.basinillo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentItemRequest {

    @NotBlank(message = "Item description is required")
    private String description;

    private String hsCode;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private BigDecimal declaredValue;

    private String currency;
}
