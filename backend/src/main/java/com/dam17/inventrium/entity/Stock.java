package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

// To be decided if this is kept or not.
// If kept -> it will be automatically generated for dashboard purposes.
public class Stock {
    private Long id;
    private Double quantity;
    private Double minQuantity;
    private LocalDateTime lastUpdated;

    private LocalDateTime createdAt;
}
