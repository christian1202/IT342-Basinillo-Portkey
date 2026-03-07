package com.it342.basinillo.dto;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.enums.ShipmentLane;
import com.it342.basinillo.enums.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentResponse {

    private Long id;
    private String vesselName;
    private String voyageNumber;
    private LocalDate arrivalDate;
    private String portOfDischarge;
    private String clientName;
    private String containerNumbers;
    private String descriptionOfGoods;
    private Integer freeDays;
    private LocalDate doomsdayDate;
    private ShipmentStatus status;
    private ShipmentLane lane;
    private String entryNumber;
    private String orNumber;
    private List<ShipmentItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /** Converts a Shipment entity → response DTO (DRY: single mapping point) */
    public static ShipmentResponse fromEntity(Shipment shipment) {
        List<ShipmentItemResponse> itemDtos = shipment.getItems().stream()
                .map(item -> ShipmentItemResponse.builder()
                        .id(item.getId())
                        .description(item.getDescription())
                        .hsCode(item.getHsCode())
                        .quantity(item.getQuantity())
                        .declaredValue(item.getDeclaredValue())
                        .currency(item.getCurrency())
                        .phpConvertedValue(item.getPhpConvertedValue())
                        .exchangeRate(item.getExchangeRate())
                        .build())
                .toList();

        return ShipmentResponse.builder()
                .id(shipment.getId())
                .vesselName(shipment.getVesselName())
                .voyageNumber(shipment.getVoyageNumber())
                .arrivalDate(shipment.getArrivalDate())
                .portOfDischarge(shipment.getPortOfDischarge())
                .clientName(shipment.getClientName())
                .containerNumbers(shipment.getContainerNumbers())
                .descriptionOfGoods(shipment.getDescriptionOfGoods())
                .freeDays(shipment.getFreeDays())
                .doomsdayDate(shipment.getDoomsdayDate())
                .status(shipment.getStatus())
                .lane(shipment.getLane())
                .entryNumber(shipment.getEntryNumber())
                .orNumber(shipment.getOrNumber())
                .items(itemDtos)
                .createdAt(shipment.getCreatedAt())
                .updatedAt(shipment.getUpdatedAt())
                .build();
    }
}
