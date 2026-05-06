package edu.cit.basinillo.portkey.features.shipments.controller;

import edu.cit.basinillo.portkey.features.auth.entity.User;
import edu.cit.basinillo.portkey.features.shipments.dto.*;
import edu.cit.basinillo.portkey.features.shipments.enums.ShipmentLane;
import edu.cit.basinillo.portkey.features.shipments.enums.ShipmentStatus;
import edu.cit.basinillo.portkey.features.shipments.service.ShipmentAnalysisService;
import edu.cit.basinillo.portkey.features.shipments.service.ShipmentService;
import edu.cit.basinillo.portkey.shared.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;
    private final ShipmentAnalysisService analysisService;

    @PostMapping
    public ResponseEntity<ApiResponse<ShipmentResponse>> create(
            @Valid @RequestBody CreateShipmentRequest request,
            @AuthenticationPrincipal User user) {
        ShipmentResponse data = shipmentService.createShipment(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(data));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getAll(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ShipmentStatus status,
            @RequestParam(required = false) ShipmentLane lane) {
        List<ShipmentResponse> data;
        if (search != null && !search.isBlank()) {
            data = shipmentService.searchShipments(user, search);
        } else if (status != null) {
            data = shipmentService.filterByStatus(user, status);
        } else if (lane != null) {
            data = shipmentService.filterByLane(user, lane);
        } else {
            data = shipmentService.getAllForUser(user);
        }
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getById(
            @PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.getById(id, user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShipmentResponse>> update(
            @PathVariable Long id, @RequestBody UpdateShipmentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.updateShipment(id, request, user)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ShipmentResponse>> advanceStatus(
            @PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(shipmentService.advanceStatus(id, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id, @AuthenticationPrincipal User user) {
        shipmentService.softDelete(id, user);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<ShipmentAnalysisResponse>> getAnalysis(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(analysisService.getAnalysisForUser(user.getId())));
    }
}
