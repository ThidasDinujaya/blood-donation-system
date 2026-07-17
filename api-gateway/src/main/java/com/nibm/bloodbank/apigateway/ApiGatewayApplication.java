package com.nibm.bloodbank.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("http://localhost:8081"))

                // Auth Service
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri("http://localhost:8081"))

                // Campaign Service
                .route("campaign-service", r -> r.path("/api/campaigns/**")
                        .uri("http://localhost:8082"))

                // Appointment Service
                .route("appointment-service", r -> r.path("/api/appointments/**")
                        .uri("http://localhost:8082"))

                // Inventory Service
                .route("inventory-service", r -> r.path("/api/bloodinventories/**")
                        .uri("http://localhost:8083"))

                // Emergency Request Service
                .route("emergency-request-service", r -> r.path("/request/**")
                        .uri("http://localhost:8084"))

                // Notification Service
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .uri("http://localhost:8085"))

                .build();
    }
}
