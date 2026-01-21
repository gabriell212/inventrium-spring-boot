package com.dam17.inventrium.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dam17.inventrium.dto.batch.BatchCreateDto;
import com.dam17.inventrium.dto.batch.BatchDetailsDto;
import com.dam17.inventrium.dto.batch.BatchUpdateDto;
import com.dam17.inventrium.entity.Batch;
import com.dam17.inventrium.entity.Product;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.entity.Warehouse;
import com.dam17.inventrium.enums.BatchStatus;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.repository.ProductRepository;
import com.dam17.inventrium.repository.WarehouseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final BatchService batchService;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public List<BatchDetailsDto> getBatchesInWarehouse(Long warehouseId) {
        List<Batch> batches = batchService.getBatchesByWarehouse(warehouseId);

        return batches.stream().map(b -> {
            BatchDetailsDto dto = new BatchDetailsDto();
            dto.setId(b.getId());
            dto.setBatchNumber(b.getBatchNumber());
            dto.setQuantity(b.getQuantity());
            dto.setCostPrice(b.getCostPrice());
            dto.setBatchStatus(b.getBatchStatus());
            dto.setReceivedDate(b.getReceivedDate());
            dto.setManufacturingDate(b.getManufacturingDate());
            dto.setExpirationDate(b.getExpirationDate());
            dto.setNotes(b.getNotes());
            dto.setProductId(b.getProduct().getId());
            dto.setProductName(b.getProduct().getName());
            dto.setWarehouseId(b.getWarehouse().getId());
            dto.setWarehouseName(b.getWarehouse().getName());
            dto.setCreatedAt(b.getCreatedAt());
            dto.setUpdatedAt(b.getUpdatedAt());
            return dto;
        }).toList();
    }

    @Override
    public void transferStockByBatch(Long batchId, Long fromWarehouseId, Long toWarehouseId, Integer quantity,
            User user) {

        if (fromWarehouseId.equals(toWarehouseId)) {
            throw new IllegalArgumentException("Cannot transfer stock to the same warehouse");
        }

        Batch sourceBatch = batchService.getBatch(batchId);

        if (!sourceBatch.getWarehouse().getId().equals(fromWarehouseId)) {
            throw new IllegalArgumentException("Batch does not belong to source warehouse");
        }

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        if (sourceBatch.getQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock in source batch");
        }

        Product product = sourceBatch.getProduct();

        Warehouse from = warehouseRepository.findById(fromWarehouseId)
                .orElseThrow(() -> new EntityNotFoundException(fromWarehouseId, Warehouse.class));

        Warehouse to = warehouseRepository.findById(toWarehouseId)
                .orElseThrow(() -> new EntityNotFoundException(toWarehouseId, Warehouse.class));

        sourceBatch.setQuantity(sourceBatch.getQuantity() - quantity);
        batchService.updateBatch(sourceBatch.getId(), mapToUpdateDto(sourceBatch), user);

        Batch newBatch = new Batch();
        newBatch.setBatchNumber(sourceBatch.getBatchNumber());
        newBatch.setQuantity(quantity);
        newBatch.setCostPrice(sourceBatch.getCostPrice());
        newBatch.setReceivedDate(sourceBatch.getReceivedDate());
        newBatch.setManufacturingDate(sourceBatch.getManufacturingDate());
        newBatch.setExpirationDate(sourceBatch.getExpirationDate());
        newBatch.setNotes("Transferred from warehouse " + from.getName());
        newBatch.setProduct(product);
        newBatch.setWarehouse(to);
        newBatch.setBatchStatus(sourceBatch.getBatchStatus());
        newBatch.setCreatedAt(LocalDateTime.now());

        batchService.createBatch(mapToCreateDto(newBatch), user, product.getCompany());
    }

    private BatchUpdateDto mapToUpdateDto(Batch batch) {
        BatchUpdateDto dto = new BatchUpdateDto();
        dto.setQuantity(batch.getQuantity());
        dto.setCostPrice(batch.getCostPrice());
        dto.setReceivedDate(batch.getReceivedDate());
        dto.setManufacturingDate(batch.getManufacturingDate());
        dto.setExpirationDate(batch.getExpirationDate());
        dto.setNotes(batch.getNotes());
        dto.setBatchStatus(batch.getBatchStatus());
        return dto;
    }

    private BatchCreateDto mapToCreateDto(Batch batch) {
        BatchCreateDto dto = new BatchCreateDto();
        dto.setBatchNumber(batch.getBatchNumber());
        dto.setQuantity(batch.getQuantity());
        dto.setCostPrice(batch.getCostPrice());
        dto.setReceivedDate(batch.getReceivedDate());
        dto.setManufacturingDate(batch.getManufacturingDate());
        dto.setExpirationDate(batch.getExpirationDate());
        dto.setNotes(batch.getNotes());
        dto.setProductId(batch.getProduct().getId());
        dto.setWarehouseId(batch.getWarehouse().getId());
        return dto;
    }
}