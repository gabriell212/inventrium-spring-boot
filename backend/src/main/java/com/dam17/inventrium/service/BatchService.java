package com.dam17.inventrium.service;

import java.util.List;

import com.dam17.inventrium.dto.batch.BatchCreateDto;
import com.dam17.inventrium.dto.batch.BatchUpdateDto;
import com.dam17.inventrium.entity.Batch;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;

public interface BatchService {
    List<Batch> getBatchesByWarehouse(Long warehouseId);
    List<Batch> getBatchesByProduct(Long productId);
    Batch getBatch(Long id);
    Batch createBatch(BatchCreateDto dto, User createdBy, Company company);
    Batch updateBatch(Long id, BatchUpdateDto dto, User updatedBy);
    void deleteBatch(Long id);

    List<Batch> getAllBatchesForCompany(Long companyId);
}