package com.dam17.inventrium.dto.warehouse;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseDetailsDto {

    private Long id;
    private String code;
    private String name;
    private String location;
    private String type;
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long companyId;
    private String createdByUsername;
    private String updatedByUsername;
}