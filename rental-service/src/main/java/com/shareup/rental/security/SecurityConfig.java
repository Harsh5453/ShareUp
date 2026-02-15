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
import org.springframework.web.cors.*;

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
                // Disable CSRF (JWT API)
                .csrf(csrf -> csrf.disable())

                // Enable CORS
                .cors(Customizer.withDefaults())

                // Stateless session (JWT)
                .sessionManagement(sess ->
                        sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Allow CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Allow system endpoints
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // ---------------- BORROWER ----------------
                        .requestMatchers(HttpMethod.POST, "/api/rentals/request")
                        .hasRole("BORROWER")

                        .requestMatchers(HttpMethod.POST, "/api/rentals/*/return")
                        .hasRole("BORROWER")

                        .requestMatchers(HttpMethod.GET, "/api/rentals/me")
                        .hasRole("BORROWER")

                        // ---------------- OWNER ----------------
                        .requestMatchers(HttpMethod.PUT, "/api/rentals/approve/*")
                        .hasRole("OWNER")

                        .requestMatchers(HttpMethod.PUT, "/api/rentals/reject/*")
                        .hasRole("OWNER")

                        .requestMatchers(HttpMethod.PUT, "/api/rentals/approve-return/*")
                        .hasRole("OWNER")

                        .requestMatchers(HttpMethod.GET, "/api/rentals/owner")
                        .hasRole("OWNER")

                        .requestMatchers(HttpMethod.GET, "/api/rentals/owner/returns")
                        .hasRole("OWNER")

                        // Everything else must be authenticated
                        .anyRequest().authenticated()
                )

                // Add JWT filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    // ---------------- GLOBAL CORS CONFIG ----------------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Allow localhost + all Vercel deployments
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://*.vercel.app"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
