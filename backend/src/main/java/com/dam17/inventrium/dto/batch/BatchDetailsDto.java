package com.dam17.inventrium.dto.batch;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.BatchStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BatchDetailsDto {

    private Long id;
    private String batchNumber;
    private Integer quantity;
    private Double costPrice;
    private BatchStatus batchStatus;

    private LocalDateTime receivedDate;
    private LocalDateTime manufacturingDate;
    private LocalDateTime expirationDate;

    private String notes;

    private Long productId;
    private String productName;

    private Long warehouseId;
    private String warehouseName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}