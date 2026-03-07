package com.it342.basinillo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentItemResponse {

    private Long id;
    private String description;
    private String hsCode;
    private Integer quantity;
    private BigDecimal declaredValue;
    private String currency;
    private BigDecimal phpConvertedValue;
    private BigDecimal exchangeRate;
}
