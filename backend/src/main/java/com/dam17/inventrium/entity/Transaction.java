package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.TransactionType;

import jakarta.persistence.Column;

public class Transaction {
    private Long id;
    private LocalDateTime date;
    private Double quantity;
    private TransactionType transactionType;
    private String notes;

    private LocalDateTime createdAt;
}
