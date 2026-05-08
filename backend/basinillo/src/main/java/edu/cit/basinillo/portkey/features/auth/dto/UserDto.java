package edu.cit.basinillo.portkey.features.auth.dto;

import edu.cit.basinillo.portkey.features.auth.entity.User;
import edu.cit.basinillo.portkey.features.auth.enums.Plan;
import edu.cit.basinillo.portkey.features.auth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Public-facing user profile DTO. Never exposes passwordHash.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Plan plan;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .plan(user.getPlan())
                .build();
    }
}
