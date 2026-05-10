package com.backendPet.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Aplicamos la configuración a todas las rutas que empiecen por /api/
        registry.addMapping("/api/**")
                // Permitimos el origen del frontend (Angular en este caso)
                .allowedOrigins("http://localhost:8081")
                // Métodos HTTP permitidos para los dos CRUDs
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Permitimos cualquier cabecera (header)
                .allowedHeaders("*")
                // Permitir envío de cookies o auth si fuera necesario
                .allowCredentials(true);
    }
}

