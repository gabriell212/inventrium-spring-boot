package com.dam17.inventrium.dto.inventory;

import lombok.Data;

@Data
public class TransferStockRequest {
    private Long batchId;
    private Long fromWarehouseId;
    private Long toWarehouseId;
    private Integer quantity;
}