package com.dam17.inventrium.dto.product;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDetailsDto {
    private Long id;
    private String name;
    private String sku;
    private String description;
    private Double purchasePrice;
    private Double basePrice;
    private Boolean requiresBatchTracking;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long categoryId;
    private String categoryName;

    private String createdByUsername;
    private String updatedByUsername;
}