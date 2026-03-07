package com.it342.basinillo.controller;

import com.it342.basinillo.dto.*;
import com.it342.basinillo.service.AdminService;
import com.it342.basinillo.service.ShipmentAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints.
 * Access is restricted to ROLE_ADMIN via SecurityConfig.
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ShipmentAnalysisService analysisService;

    @GetMapping("/shipments")
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getAllShipments() {
        List<ShipmentResponse> data = adminService.getAllShipments();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> data = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto data = adminService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<ShipmentAnalysisResponse>> getGlobalAnalysis() {
        ShipmentAnalysisResponse data = analysisService.getGlobalAnalysis();
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
