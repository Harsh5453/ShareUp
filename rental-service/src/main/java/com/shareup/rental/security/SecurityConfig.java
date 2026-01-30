package com.shareup.rental.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // Borrower actions
                .requestMatchers(HttpMethod.POST, "/api/rentals/request").hasRole("BORROWER")
                .requestMatchers(HttpMethod.POST, "/api/rentals/*/return").hasRole("BORROWER")
                .requestMatchers(HttpMethod.GET, "/api/rentals/me").hasRole("BORROWER")

                // Owner actions
                .requestMatchers(HttpMethod.PUT, "/api/rentals/approve/*").hasRole("OWNER")
                .requestMatchers(HttpMethod.PUT, "/api/rentals/reject/*").hasRole("OWNER")
                .requestMatchers(HttpMethod.PUT, "/api/rentals/approve-return/*").hasRole("OWNER")
               

                .requestMatchers(HttpMethod.GET, "/api/rentals/owner").hasRole("OWNER")
                .requestMatchers(HttpMethod.GET, "/api/rentals/owner/returns").hasRole("OWNER")

                // Image access
                .requestMatchers(HttpMethod.GET, "/api/rentals/*/return-image").permitAll()

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // CORS for frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
