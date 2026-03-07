package com.it342.basinillo.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateShipmentRequest {

    @NotBlank(message = "Vessel name is required")
    private String vesselName;

    private String voyageNumber;

    @NotNull(message = "Arrival date is required")
    private LocalDate arrivalDate;

    private String portOfDischarge;

    @NotBlank(message = "Client name is required")
    private String clientName;

    private String containerNumbers;

    private String descriptionOfGoods;

    private Integer freeDays;

    private String entryNumber;

    private String orNumber;

    @Valid
    private List<ShipmentItemRequest> items;
}
