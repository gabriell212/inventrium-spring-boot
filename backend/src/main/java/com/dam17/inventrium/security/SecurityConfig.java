package com.dam17.inventrium.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.dam17.inventrium.security.filter.AuthenticationFilter;
import com.dam17.inventrium.security.filter.ExceptionHandlerFilter;
import com.dam17.inventrium.security.filter.JWTAuthorizationFilter;
import com.dam17.inventrium.security.manager.CustomAuthenticationManager;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    
    private final CustomAuthenticationManager customAuthenticationManager;
    private final String secretKey;
    private final ExceptionHandlerFilter exceptionHandlerFilter;
    private final ObjectMapper mapper;
    
    public SecurityConfig(CustomAuthenticationManager customAuthenticationManager, @Value("${jwt.secret}") String secretKey, ExceptionHandlerFilter exceptionHandlerFilter, ObjectMapper mapper) {
        this.customAuthenticationManager = customAuthenticationManager;
        this.secretKey = secretKey;
        this.exceptionHandlerFilter = exceptionHandlerFilter;
        this.mapper = mapper;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(customAuthenticationManager, secretKey, mapper);
        authenticationFilter.setFilterProcessesUrl("/authenticate");
        http
        .cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.POST, SecurityConstants.REGISTER_PATH).permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(exceptionHandlerFilter, AuthenticationFilter.class)
        .addFilter(authenticationFilter)
        .addFilterAfter(new JWTAuthorizationFilter(this.secretKey), AuthenticationFilter.class)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
