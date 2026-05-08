package edu.cit.basinillo.portkey.features.shipments.service;

import edu.cit.basinillo.portkey.features.shipments.dto.ShipmentAnalysisResponse;
import edu.cit.basinillo.portkey.features.shipments.enums.ShipmentStatus;
import edu.cit.basinillo.portkey.features.shipments.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShipmentAnalysisService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentAnalysisResponse getAnalysisForUser(Long userId) {
        long total = shipmentRepository.countByUserIdAndDeletedAtIsNull(userId);
        long completed = shipmentRepository.countByUserIdAndStatusAndDeletedAtIsNull(userId, ShipmentStatus.RELEASED);
        long active = total - completed;
        return ShipmentAnalysisResponse.builder()
                .totalShipments(total).activeShipments(active).completedShipments(completed)
                .averageLeadTimeDays(0.0).build();
    }

    public ShipmentAnalysisResponse getGlobalAnalysis() {
        long total = shipmentRepository.countByDeletedAtIsNull();
        long completed = shipmentRepository.countByStatusAndDeletedAtIsNull(ShipmentStatus.RELEASED);
        long active = total - completed;
        return ShipmentAnalysisResponse.builder()
                .totalShipments(total).activeShipments(active).completedShipments(completed)
                .averageLeadTimeDays(0.0).build();
    }
}
