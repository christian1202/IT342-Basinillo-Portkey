package com.it342.basinillo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentAnalysisResponse {

    private long totalShipments;
    private long activeShipments;
    private long completedShipments;
    private double averageLeadTimeDays;
}
