package com.shareup.rental.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();

        // ✅ If auth-service or item-service is slow/down,
        //    fail fast instead of hanging the entire request
        factory.setConnectTimeout(3000);  // 3 seconds to establish connection
        factory.setReadTimeout(5000);     // 5 seconds to read response

        return new RestTemplate(factory);
    }
}