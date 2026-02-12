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
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())

            .sessionManagement(sess ->
                sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // allow preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ---------- BORROWER ----------
                .requestMatchers(HttpMethod.POST, "/api/rentals/request")
                    .hasAuthority("ROLE_BORROWER")

                .requestMatchers(HttpMethod.POST, "/api/rentals/*/return")
                    .hasAuthority("ROLE_BORROWER")

                .requestMatchers(HttpMethod.GET, "/api/rentals/me")
                    .hasAuthority("ROLE_BORROWER")

                // ---------- OWNER ----------
                .requestMatchers(HttpMethod.PUT, "/api/rentals/approve/*")
                    .hasAuthority("ROLE_OWNER")

                .requestMatchers(HttpMethod.PUT, "/api/rentals/reject/*")
                    .hasAuthority("ROLE_OWNER")

                .requestMatchers(HttpMethod.PUT, "/api/rentals/approve-return/*")
                    .hasAuthority("ROLE_OWNER")

                .requestMatchers(HttpMethod.GET, "/api/rentals/owner")
                    .hasAuthority("ROLE_OWNER")

                .requestMatchers(HttpMethod.GET, "/api/rentals/owner/returns")
                    .hasAuthority("ROLE_OWNER")

                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

            .build();
    }


    // ---------- CORS CONFIG ----------
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://share-g3a2q3e9m-harshs-projects-1c5cf0ac.vercel.app"
        ));

        config.setAllowedMethods(List.of(
            "GET","POST","PUT","DELETE","OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type"
        ));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
