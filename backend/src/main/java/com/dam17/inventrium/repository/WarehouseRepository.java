package com.dam17.inventrium.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByCompanyId(Long companyId);
    boolean existsByCodeAndCompanyId(String code, Long companyId);
}
