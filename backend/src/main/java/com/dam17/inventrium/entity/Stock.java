package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

public class Stock {
    private Long id;
    private Double quantity;
    private Double minQuantity;
    private LocalDateTime lastUpdated;

    private LocalDateTime createdAt;
}
