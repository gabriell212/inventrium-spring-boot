package com.dam17.inventrium.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.dam17.inventrium.security.filter.AuthenticationFilter;
import com.dam17.inventrium.security.filter.ExceptionHandlerFilter;
import com.dam17.inventrium.security.filter.JWTAuthorizationFilter;
import com.dam17.inventrium.security.manager.CustomAuthenticationManager;
@Configuration
public class SecurityConfig {
    
    private final CustomAuthenticationManager customAuthenticationManager;
    private final String secretKey;
    
    public SecurityConfig(CustomAuthenticationManager customAuthenticationManager, @Value("${jwt.secret}") String secretKey) {
        this.customAuthenticationManager = customAuthenticationManager;
        this.secretKey = secretKey;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(customAuthenticationManager, secretKey);
        authenticationFilter.setFilterProcessesUrl("/authenticate");
        http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.POST, SecurityConstants.REGISTER_PATH).permitAll()
            .anyRequest().authenticated()
        )
        .addFilterBefore(new ExceptionHandlerFilter(), AuthenticationFilter.class)
        .addFilter(authenticationFilter)
        .addFilterAfter(new JWTAuthorizationFilter(this.secretKey), AuthenticationFilter.class)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
