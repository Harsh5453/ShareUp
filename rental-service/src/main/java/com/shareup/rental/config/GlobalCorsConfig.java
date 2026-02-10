package com.shareup.rental.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class GlobalCorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:5173",
                "https://share-g3a2q3e9m-harshs-projects-1c5cf0ac.vercel.app"
            )
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
