package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

public class Category {
    private Long id;
    private String name;
    private String description;
    
    private LocalDateTime createdAt;
}
