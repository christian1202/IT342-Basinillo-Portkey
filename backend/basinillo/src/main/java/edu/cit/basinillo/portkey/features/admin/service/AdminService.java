package edu.cit.basinillo.portkey.features.admin.service;

import edu.cit.basinillo.portkey.features.auth.dto.UserDto;
import edu.cit.basinillo.portkey.features.auth.entity.User;
import edu.cit.basinillo.portkey.features.auth.repository.UserRepository;
import edu.cit.basinillo.portkey.features.shipments.dto.ShipmentResponse;
import edu.cit.basinillo.portkey.features.shipments.repository.ShipmentRepository;
import edu.cit.basinillo.portkey.shared.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;

    public List<ShipmentResponse> getAllShipments() {
        return shipmentRepository.findByDeletedAtIsNullOrderByDoomsdayDateAsc()
                .stream().map(ShipmentResponse::fromEntity).toList();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream().map(UserDto::fromEntity).toList();
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return UserDto.fromEntity(user);
    }
}
