package com.it342.basinillo.service;

import com.it342.basinillo.dto.ShipmentResponse;
import com.it342.basinillo.dto.UserDto;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.exception.ResourceNotFoundException;
import com.it342.basinillo.repository.ShipmentRepository;
import com.it342.basinillo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Admin-only service — provides unrestricted access to all shipments and user accounts.
 * Authorization is enforced at the controller/SecurityConfig level (ROLE_ADMIN).
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;

    public List<ShipmentResponse> getAllShipments() {
        return shipmentRepository.findByDeletedAtIsNullOrderByDoomsdayDateAsc()
                .stream()
                .map(ShipmentResponse::fromEntity)
                .toList();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .toList();
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return UserDto.fromEntity(user);
    }
}
