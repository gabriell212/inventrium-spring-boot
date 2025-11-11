package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

public class Warehouse {
    private Long id;
    private String name;
    private String location;

    private LocalDateTime createdAt;
}
