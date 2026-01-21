package com.dam17.inventrium.service;

import java.util.List;

import com.dam17.inventrium.dto.batch.BatchDetailsDto;
import com.dam17.inventrium.entity.User;

public interface InventoryService {

    // Warehouse UI
    List<BatchDetailsDto> getBatchesInWarehouse(Long warehouseId);

    void transferStockByBatch(Long batchId, Long fromWarehouseId, Long toWarehouseId, Integer quantity, User user);
}