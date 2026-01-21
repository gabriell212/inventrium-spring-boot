package com.dam17.inventrium.service;

import java.util.List;

import com.dam17.inventrium.dto.warehouse.WarehouseCreateDto;
import com.dam17.inventrium.dto.warehouse.WarehouseUpdateDto;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.entity.Warehouse;

public interface WarehouseService {
    Warehouse getWarehouse(Long id);
    Warehouse createWarehouse(WarehouseCreateDto dto, User createdBy, Company company);
    Warehouse updateWarehouse(Long id, WarehouseUpdateDto dto, User updatedBy);
    void deleteWarehouse(Long id);
    List<Warehouse> getWarehousesByCompany(Long companyId);
}