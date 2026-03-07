package edu.cit.basinillo.portkey.service;

import edu.cit.basinillo.portkey.dto.*;
import edu.cit.basinillo.portkey.entity.User;
import edu.cit.basinillo.portkey.exception.DuplicateResourceException;
import edu.cit.basinillo.portkey.exception.UnauthorizedException;
import edu.cit.basinillo.portkey.repository.UserRepository;
import edu.cit.basinillo.portkey.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new broker account.
     * - Checks for duplicate email
     * - Hashes password with BCrypt(12)
     * - Generates JWT pair
     */
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    /**
     * Authenticates a user and returns JWT tokens.
     * Spring Security's AuthenticationManager handles credential validation.
     */
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return buildAuthResponse(user);
    }

    /** Returns the current user's profile based on the authenticated principal. */
    public UserDto getCurrentUser(User user) {
        return UserDto.fromEntity(user);
    }

    // ── Private helper (DRY) ─────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .user(UserDto.fromEntity(user))
                .accessToken(jwtService.generateAccessToken(user))
                .refreshToken(jwtService.generateRefreshToken(user))
                .build();
    }
}
