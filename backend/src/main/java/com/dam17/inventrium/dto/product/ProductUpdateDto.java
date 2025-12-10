package com.dam17.inventrium.dto.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductUpdateDto {

    @NotBlank(message = "Product name cannot be blank")
    private String name;

    @NotBlank(message = "SKU cannot be blank")
    private String sku;

    @NotBlank(message = "Description cannot be blank")
    private String description;

    @DecimalMin(value = "0.0", inclusive = true, message = "Purchase price must be non-negative")
    @NotNull(message = "Purchase price is required")
    private Double purchasePrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Base price must be non-negative")
    @NotNull(message = "Base price is required")
    private Double basePrice;

    @NotNull(message = "Batch tracking selection is required")
    private Boolean requiresBatchTracking;

    private Long categoryId;
}