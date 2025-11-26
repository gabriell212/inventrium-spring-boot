package com.dam17.inventrium.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JwtUtils {
    private String secretKey;

    public JwtUtils(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
    }

    public DecodedJWT decodeToken(String token) {
        return JWT.require(Algorithm.HMAC512(secretKey)).build().verify(token);
    }

    public Long extractUserId(String token) {
        return decodeToken(token).getClaim("userId").asLong();
    }

    public Long extractCompanyId(String token) {
        return decodeToken(token).getClaim("companyId").asLong();
    }

    public String extractRole(String token) {
        return decodeToken(token).getClaim("role").asString();
    }
}
