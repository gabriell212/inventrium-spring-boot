package com.dam17.inventrium.dto.batch;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BatchCreateDto {

    @NotBlank(message = "Batch number cannot be blank")
    private String batchNumber;

    @Min(value = 0, message = "Quantity must be non-negative")
    private Integer quantity;

    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    private Double costPrice;

    @PastOrPresent(message = "Received date cannot be in the future")
    private LocalDateTime receivedDate;

    @PastOrPresent(message = "Manufacturing date cannot be in the future")
    private LocalDateTime manufacturingDate;

    @Future(message = "Expiration date must be in the future")
    private LocalDateTime expirationDate;

    private String notes;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Warehouse ID is required")
    private Long warehouseId;
}