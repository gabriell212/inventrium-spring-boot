package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.PurchaseOrderStatus;

public class PurchaseOrder {
    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private LocalDateTime expectedDeliveryDate;
    private PurchaseOrderStatus status;
    private Double totalAmount;
    private String notes;

    private LocalDateTime createdAt;
}
