package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

public class Batch {
    private Long id;
    private String batchNumber;
    private Double costPrice;
    private LocalDateTime receivedDate;
    private LocalDateTime expirationDate;
    private LocalDateTime manufacturingDate;
    private String notes;

    private LocalDateTime createdAt;
}
