package com.dam17.inventrium.dto.warehouse;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseCreateDto {

    @NotBlank(message = "Warehouse code cannot be blank")
    private String code;

    @NotBlank(message = "Warehouse name cannot be blank")
    private String name;

    @NotBlank(message = "Location cannot be blank")
    private String location;

    @NotNull(message = "Warehouse type is required")
    private String type;

    private Boolean isActive = true;
}
