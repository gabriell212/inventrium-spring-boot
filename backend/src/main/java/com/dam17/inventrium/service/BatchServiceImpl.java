package com.dam17.inventrium.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dam17.inventrium.dto.batch.BatchCreateDto;
import com.dam17.inventrium.dto.batch.BatchUpdateDto;
import com.dam17.inventrium.entity.Batch;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.Product;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.entity.Warehouse;
import com.dam17.inventrium.enums.BatchStatus;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.repository.BatchRepository;
import com.dam17.inventrium.repository.ProductRepository;
import com.dam17.inventrium.repository.WarehouseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BatchServiceImpl implements BatchService {

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Override
    public Batch getBatch(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Batch.class));
    }

    @Override
    public List<Batch> getAllBatchesForCompany(Long companyId) {
        return batchRepository.findByCompanyId(companyId);
    }

    @Override
    public Batch createBatch(BatchCreateDto dto, User createdBy, Company company) {

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException(dto.getProductId(), Product.class));

        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new EntityNotFoundException(dto.getWarehouseId(), Warehouse.class));

        Batch batch = new Batch();
        batch.setBatchNumber(dto.getBatchNumber());
        batch.setQuantity(dto.getQuantity());
        batch.setCostPrice(dto.getCostPrice());
        batch.setReceivedDate(dto.getReceivedDate());
        batch.setManufacturingDate(dto.getManufacturingDate());
        batch.setExpirationDate(dto.getExpirationDate());
        batch.setNotes(dto.getNotes());

        batch.setProduct(product);
        batch.setWarehouse(warehouse);
        batch.setCompany(company);

        batch.setCreatedBy(createdBy);
        batch.setCreatedAt(LocalDateTime.now());

        batch.setUpdatedBy(createdBy);
        batch.setUpdatedAt(LocalDateTime.now());

        // business logic
        if (dto.getExpirationDate() != null && dto.getExpirationDate().isBefore(LocalDateTime.now())) {
            batch.setBatchStatus(BatchStatus.EXPIRED);
        } else {
            batch.setBatchStatus(BatchStatus.AVAILABLE);
        }

        return batchRepository.save(batch);
    }

    @Override
    public Batch updateBatch(Long id, BatchUpdateDto dto, User updatedBy) {

        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Batch.class));

        batch.setQuantity(dto.getQuantity());
        batch.setCostPrice(dto.getCostPrice());
        batch.setReceivedDate(dto.getReceivedDate());
        batch.setManufacturingDate(dto.getManufacturingDate());
        batch.setExpirationDate(dto.getExpirationDate());
        batch.setNotes(dto.getNotes());
        batch.setBatchStatus(dto.getBatchStatus());

        batch.setUpdatedBy(updatedBy);
        batch.setUpdatedAt(LocalDateTime.now());

        return batchRepository.save(batch);
    }

    @Override
    public void deleteBatch(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Batch.class));

        batchRepository.delete(batch);
    }

    @Override
    public List<Batch> getBatchesByProduct(Long productId) {
        return batchRepository.findByProductId(productId);
    }

    @Override
    public List<Batch> getBatchesByWarehouse(Long warehouseId) {
        return batchRepository.findByWarehouseId(warehouseId);
    }
}