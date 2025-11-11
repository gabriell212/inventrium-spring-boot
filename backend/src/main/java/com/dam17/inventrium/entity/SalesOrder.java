package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.SalesOrderStatus;

public class SalesOrder {
    private Long id;
    private String orderNumber;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private SalesOrderStatus status;
    private Double totalAmount;
    private String notes;

    private LocalDateTime createdAt;
}
