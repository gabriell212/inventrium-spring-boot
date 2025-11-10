package com.dam17.inventrium.enums;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum RoleType {
    ADMINISTRATOR,
    MANAGER,
    OPERATOR,
    VIEWER,
    PENDING; // This is for users that have not logged into a company yet

    // Set authorities for roles
    public List<SimpleGrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.name()));
    }
}
