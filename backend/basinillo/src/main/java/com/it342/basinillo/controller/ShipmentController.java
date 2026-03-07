package com.it342.basinillo.controller;

import com.it342.basinillo.dto.*;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.enums.ShipmentLane;
import com.it342.basinillo.enums.ShipmentStatus;
import com.it342.basinillo.service.ShipmentAnalysisService;
import com.it342.basinillo.service.ShipmentService;
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

    // ── CRUD ─────────────────────────────────────────────────

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
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        ShipmentResponse data = shipmentService.getById(id, user);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShipmentResponse>> update(
            @PathVariable Long id,
            @RequestBody UpdateShipmentRequest request,
            @AuthenticationPrincipal User user) {
        ShipmentResponse data = shipmentService.updateShipment(id, request, user);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ShipmentResponse>> advanceStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        ShipmentResponse data = shipmentService.advanceStatus(id, user);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        shipmentService.softDelete(id, user);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    // ── Analysis ─────────────────────────────────────────────

    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<ShipmentAnalysisResponse>> getAnalysis(
            @AuthenticationPrincipal User user) {
        ShipmentAnalysisResponse data = analysisService.getAnalysisForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
