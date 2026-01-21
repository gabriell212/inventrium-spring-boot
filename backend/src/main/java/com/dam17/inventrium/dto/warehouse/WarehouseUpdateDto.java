package com.dam17.inventrium.dto.warehouse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseUpdateDto {

    @NotBlank(message = "Warehouse name cannot be blank")
    private String name;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    @NotNull(message = "Warehouse type is required")
    private String type;

    @NotNull(message = "Active status is required")
    private Boolean isActive;
}