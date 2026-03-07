package edu.cit.basinillo.portkey.dto;

import edu.cit.basinillo.portkey.enums.ShipmentLane;
import edu.cit.basinillo.portkey.enums.ShipmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateShipmentRequest {

    private String vesselName;
    private String voyageNumber;
    private LocalDate arrivalDate;
    private String portOfDischarge;
    private String clientName;
    private String containerNumbers;
    private String descriptionOfGoods;
    private Integer freeDays;
    private ShipmentStatus status;
    private ShipmentLane lane;
    private String entryNumber;
    private String orNumber;
}
