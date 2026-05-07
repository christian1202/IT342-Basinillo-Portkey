/* ================================================================== */
/*  PORTKEY — Custom UserDetailsService                                 */
/*  Vertical Slice Architecture: Shared Infrastructure                 */
/*  Loads user by email for Spring Security authentication.            */
/* ================================================================== */

package edu.cit.basinillo.portkey.shared.infrastructure;

import edu.cit.basinillo.portkey.features.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
