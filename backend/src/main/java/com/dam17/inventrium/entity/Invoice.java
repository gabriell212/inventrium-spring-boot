package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.InvoiceStatus;
import com.dam17.inventrium.enums.InvoiceType;

public class Invoice {
    private Long id;
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private LocalDateTime dueDate;
    private InvoiceType type;
    private InvoiceStatus status;
    private Double subtotal;
    private Double taxAmount;
    private Double totalAmount;
    private String notes;

    private LocalDateTime createdAt;
}
