package edu.cit.basinillo.portkey.features.admin.controller;

import edu.cit.basinillo.portkey.features.admin.service.AdminService;
import edu.cit.basinillo.portkey.features.auth.dto.UserDto;
import edu.cit.basinillo.portkey.features.shipments.dto.ShipmentAnalysisResponse;
import edu.cit.basinillo.portkey.features.shipments.dto.ShipmentResponse;
import edu.cit.basinillo.portkey.features.shipments.service.ShipmentAnalysisService;
import edu.cit.basinillo.portkey.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ShipmentAnalysisService analysisService;

    @GetMapping("/shipments")
    public ResponseEntity<ApiResponse<List<ShipmentResponse>>> getAllShipments() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllShipments()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUserById(id)));
    }

    @GetMapping("/analysis")
    public ResponseEntity<ApiResponse<ShipmentAnalysisResponse>> getGlobalAnalysis() {
        return ResponseEntity.ok(ApiResponse.success(analysisService.getGlobalAnalysis()));
    }
}
