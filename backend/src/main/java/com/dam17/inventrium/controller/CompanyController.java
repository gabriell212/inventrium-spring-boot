package com.dam17.inventrium.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dam17.inventrium.annotation.CompanyRestricted;
import com.dam17.inventrium.dto.JoinCompanyRequest;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.security.SecurityConstants;
import com.dam17.inventrium.service.CompanyService;
import com.dam17.inventrium.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/company")
public class CompanyController {
    
    private CompanyService companyService;
    private UserService userService;
    private String secretKey;

    public CompanyController(CompanyService companyService, UserService userService, @Value("${jwt.secret}") String secretKey) {
        this.companyService = companyService;
        this.userService = userService;
        this.secretKey = secretKey;
    }


    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompany(@PathVariable Long id) {
        return new ResponseEntity<>(companyService.getCompany(id), HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('PENDING')")
    @PostMapping
    public ResponseEntity<Company> createCompany(@Valid @RequestBody Company company, HttpServletRequest request) {
        // Decode the current JWT
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(secretKey)).build().verify(token);

        // Access the user id from the current JWT and create the company
        Long userId = jwt.getClaim("userId").asLong();
        User creator = userService.getUser(userId);
        Company savedCompany = companyService.saveCompany(company, creator);

        // Generate a new JWT updating the role and companyId
        String newToken = JWT.create()
            .withSubject(creator.getUsername())
            .withClaim("role", creator.getRole().name())
            .withClaim("userId", creator.getId())
            .withClaim("companyId", savedCompany.getId())
            .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.TOKEN_EXPIRATION))
            .sign(Algorithm.HMAC512(secretKey));
        return ResponseEntity.status(HttpStatus.CREATED)
            .header(SecurityConstants.AUTHORIZATION, SecurityConstants.BEARER + newToken)
            .body(savedCompany);
    }

    @CompanyRestricted(companyIdParam = "id")
    @PreAuthorize("hasRole('ADMINISTRATOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasRole('PENDING')")
    @PostMapping("/join")
    public ResponseEntity<?> joinCompany(@Valid @RequestBody JoinCompanyRequest request, HttpServletRequest httpRequest) {
        String token = httpRequest.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");
        DecodedJWT jwt = JWT.require(Algorithm.HMAC512(secretKey)).build().verify(token);

        Long userId = jwt.getClaim("userId").asLong();
        User user = userService.getUser(userId);

        if(user.getCompany() != null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User already belongs to a company!");
        }

        Company company = companyService.joinCompany(request.getCui(), request.getAuthPassword(), user);

        String newToken = JWT.create()
            .withSubject(user.getUsername())
            .withClaim("role", user.getRole().name())
            .withClaim("userId", user.getId())
            .withClaim("companyId", company.getId())
            .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.TOKEN_EXPIRATION))
            .sign(Algorithm.HMAC512(secretKey));

        return ResponseEntity.ok()
            .header(SecurityConstants.AUTHORIZATION, SecurityConstants.BEARER + newToken)
            .body(company);
    }
    
}
