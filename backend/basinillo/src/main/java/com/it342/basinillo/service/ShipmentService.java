package com.it342.basinillo.service;

import com.it342.basinillo.dto.*;
import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.entity.ShipmentItem;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.enums.ShipmentLane;
import com.it342.basinillo.enums.ShipmentStatus;
import com.it342.basinillo.exception.ResourceNotFoundException;
import com.it342.basinillo.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    private static final int DEFAULT_FREE_DAYS = 5;

    // ── Create ───────────────────────────────────────────────

    @Transactional
    public ShipmentResponse createShipment(CreateShipmentRequest request, User currentUser) {
        int freeDays = request.getFreeDays() != null ? request.getFreeDays() : DEFAULT_FREE_DAYS;
        LocalDate doomsdayDate = computeDoomsdayDate(request.getArrivalDate(), freeDays);

        Shipment shipment = Shipment.builder()
                .user(currentUser)
                .vesselName(request.getVesselName())
                .voyageNumber(request.getVoyageNumber())
                .arrivalDate(request.getArrivalDate())
                .portOfDischarge(request.getPortOfDischarge())
                .clientName(request.getClientName())
                .containerNumbers(request.getContainerNumbers())
                .descriptionOfGoods(request.getDescriptionOfGoods())
                .freeDays(freeDays)
                .doomsdayDate(doomsdayDate)
                .entryNumber(request.getEntryNumber())
                .orNumber(request.getOrNumber())
                .build();

        if (request.getItems() != null) {
            request.getItems().forEach(itemReq -> addItemToShipment(shipment, itemReq));
        }

        Shipment saved = shipmentRepository.save(shipment);
        return ShipmentResponse.fromEntity(saved);
    }

    // ── Read ─────────────────────────────────────────────────

    public List<ShipmentResponse> getAllForUser(User user) {
        return shipmentRepository.findByUserIdAndDeletedAtIsNullOrderByDoomsdayDateAsc(user.getId())
                .stream()
                .map(ShipmentResponse::fromEntity)
                .toList();
    }

    public ShipmentResponse getById(Long id, User user) {
        Shipment shipment = findShipmentOrThrow(id);
        verifyOwnership(shipment, user);
        return ShipmentResponse.fromEntity(shipment);
    }

    public List<ShipmentResponse> searchShipments(User user, String keyword) {
        return shipmentRepository.searchByKeyword(user.getId(), keyword)
                .stream()
                .map(ShipmentResponse::fromEntity)
                .toList();
    }

    public List<ShipmentResponse> filterByStatus(User user, ShipmentStatus status) {
        return shipmentRepository.findByUserIdAndStatusAndDeletedAtIsNullOrderByDoomsdayDateAsc(user.getId(), status)
                .stream()
                .map(ShipmentResponse::fromEntity)
                .toList();
    }

    public List<ShipmentResponse> filterByLane(User user, ShipmentLane lane) {
        return shipmentRepository.findByUserIdAndLaneAndDeletedAtIsNullOrderByDoomsdayDateAsc(user.getId(), lane)
                .stream()
                .map(ShipmentResponse::fromEntity)
                .toList();
    }

    // ── Update ───────────────────────────────────────────────

    @Transactional
    public ShipmentResponse updateShipment(Long id, UpdateShipmentRequest request, User user) {
        Shipment shipment = findShipmentOrThrow(id);
        verifyOwnership(shipment, user);

        applyUpdates(shipment, request);

        Shipment saved = shipmentRepository.save(shipment);
        return ShipmentResponse.fromEntity(saved);
    }

    @Transactional
    public ShipmentResponse advanceStatus(Long id, User user) {
        Shipment shipment = findShipmentOrThrow(id);
        verifyOwnership(shipment, user);

        ShipmentStatus nextStatus = getNextStatus(shipment.getStatus());
        shipment.setStatus(nextStatus);

        Shipment saved = shipmentRepository.save(shipment);
        return ShipmentResponse.fromEntity(saved);
    }

    // ── Soft Delete ──────────────────────────────────────────

    @Transactional
    public void softDelete(Long id, User user) {
        Shipment shipment = findShipmentOrThrow(id);
        verifyOwnership(shipment, user);
        shipment.setDeletedAt(LocalDateTime.now());
        shipmentRepository.save(shipment);
    }

    // ── Private helpers (DRY) ────────────────────────────────

    private Shipment findShipmentOrThrow(Long id) {
        return shipmentRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found: " + id));
    }

    private void verifyOwnership(Shipment shipment, User user) {
        if (!shipment.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have access to this shipment");
        }
    }

    private LocalDate computeDoomsdayDate(LocalDate arrivalDate, int freeDays) {
        return arrivalDate != null ? arrivalDate.plusDays(freeDays) : null;
    }

    private ShipmentStatus getNextStatus(ShipmentStatus current) {
        return switch (current) {
            case ARRIVED  -> ShipmentStatus.LODGED;
            case LODGED   -> ShipmentStatus.ASSESSED;
            case ASSESSED -> ShipmentStatus.PAID;
            case PAID     -> ShipmentStatus.RELEASED;
            case RELEASED -> throw new IllegalStateException("Shipment is already released");
        };
    }

    private void addItemToShipment(Shipment shipment, ShipmentItemRequest req) {
        ShipmentItem item = ShipmentItem.builder()
                .shipment(shipment)
                .description(req.getDescription())
                .hsCode(req.getHsCode())
                .quantity(req.getQuantity())
                .declaredValue(req.getDeclaredValue())
                .currency(req.getCurrency())
                .build();
        shipment.getItems().add(item);
    }

    private void applyUpdates(Shipment shipment, UpdateShipmentRequest req) {
        if (req.getVesselName() != null)       shipment.setVesselName(req.getVesselName());
        if (req.getVoyageNumber() != null)     shipment.setVoyageNumber(req.getVoyageNumber());
        if (req.getArrivalDate() != null) {
            shipment.setArrivalDate(req.getArrivalDate());
            shipment.setDoomsdayDate(computeDoomsdayDate(req.getArrivalDate(), shipment.getFreeDays()));
        }
        if (req.getPortOfDischarge() != null)  shipment.setPortOfDischarge(req.getPortOfDischarge());
        if (req.getClientName() != null)       shipment.setClientName(req.getClientName());
        if (req.getContainerNumbers() != null) shipment.setContainerNumbers(req.getContainerNumbers());
        if (req.getDescriptionOfGoods() != null) shipment.setDescriptionOfGoods(req.getDescriptionOfGoods());
        if (req.getFreeDays() != null) {
            shipment.setFreeDays(req.getFreeDays());
            shipment.setDoomsdayDate(computeDoomsdayDate(shipment.getArrivalDate(), req.getFreeDays()));
        }
        if (req.getStatus() != null)           shipment.setStatus(req.getStatus());
        if (req.getLane() != null)              shipment.setLane(req.getLane());
        if (req.getEntryNumber() != null)      shipment.setEntryNumber(req.getEntryNumber());
        if (req.getOrNumber() != null)         shipment.setOrNumber(req.getOrNumber());
    }
}
