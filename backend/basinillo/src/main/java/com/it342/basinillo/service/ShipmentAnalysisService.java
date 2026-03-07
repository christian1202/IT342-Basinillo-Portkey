package com.it342.basinillo.service;

import com.it342.basinillo.dto.ShipmentAnalysisResponse;
import com.it342.basinillo.enums.ShipmentStatus;
import com.it342.basinillo.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShipmentAnalysisService {

    private final ShipmentRepository shipmentRepository;

    /** Broker-scoped analysis: counts only the authenticated user's shipments. */
    public ShipmentAnalysisResponse getAnalysisForUser(Long userId) {
        long total = shipmentRepository.countByUserIdAndDeletedAtIsNull(userId);
        long completed = shipmentRepository.countByUserIdAndStatusAndDeletedAtIsNull(userId, ShipmentStatus.RELEASED);
        long active = total - completed;

        return ShipmentAnalysisResponse.builder()
                .totalShipments(total)
                .activeShipments(active)
                .completedShipments(completed)
                .averageLeadTimeDays(0.0) // Placeholder — requires date diff query
                .build();
    }

    /** Admin-scoped analysis: counts across all brokers. */
    public ShipmentAnalysisResponse getGlobalAnalysis() {
        long total = shipmentRepository.countByDeletedAtIsNull();
        long completed = shipmentRepository.countByStatusAndDeletedAtIsNull(ShipmentStatus.RELEASED);
        long active = total - completed;

        return ShipmentAnalysisResponse.builder()
                .totalShipments(total)
                .activeShipments(active)
                .completedShipments(completed)
                .averageLeadTimeDays(0.0)
                .build();
    }
}
