package com.dam17.inventrium.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.Batch;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByWarehouseId(Long warehouseId);
    List<Batch> findByProductId(Long productId);
    List<Batch> findByCompanyId(Long companyId);
}
