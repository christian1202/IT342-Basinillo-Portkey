package edu.cit.basinillo.portkey.features.shipments.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateShipmentRequest {
    @NotBlank(message = "Vessel name is required")
    private String vesselName;

    private String voyageNumber;
    private LocalDate arrivalDate;
    private String portOfDischarge;

    @NotBlank(message = "Client name is required")
    private String clientName;

    private String containerNumbers;
    private String descriptionOfGoods;
    private Integer freeDays;
    private String entryNumber;
    private String orNumber;
    private List<ShipmentItemRequest> items;
}
