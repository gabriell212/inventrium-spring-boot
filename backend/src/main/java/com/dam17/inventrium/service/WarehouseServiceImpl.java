package com.dam17.inventrium.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.dam17.inventrium.dto.warehouse.WarehouseCreateDto;
import com.dam17.inventrium.dto.warehouse.WarehouseUpdateDto;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.entity.Warehouse;
import com.dam17.inventrium.enums.WarehouseType;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.repository.WarehouseRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    public Warehouse getWarehouse(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Warehouse.class));
    }

    @Override
    public Warehouse createWarehouse(WarehouseCreateDto dto, User createdBy, Company company) {
        // Validate unique code inside the company
        if (warehouseRepository.existsByCodeAndCompanyId(dto.getCode(), company.getId())) {
            throw new IllegalArgumentException("Warehouse code already exists for this company");
        }

        Warehouse warehouse = new Warehouse();
        warehouse.setCode(dto.getCode());
        warehouse.setName(dto.getName());
        warehouse.setLocation(dto.getLocation());
        warehouse.setType(WarehouseType.valueOf(dto.getType()));
        warehouse.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        warehouse.setCompany(company);
        warehouse.setCreatedBy(createdBy);
        warehouse.setUpdatedBy(createdBy);

        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());

        return warehouseRepository.save(warehouse);
    }

    @Override
    public Warehouse updateWarehouse(Long id, WarehouseUpdateDto dto, User updatedBy) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Warehouse.class));

        warehouse.setName(dto.getName());
        warehouse.setLocation(dto.getLocation());
        warehouse.setType(WarehouseType.valueOf(dto.getType()));
        warehouse.setIsActive(dto.getIsActive());

        warehouse.setUpdatedBy(updatedBy);
        warehouse.setUpdatedAt(LocalDateTime.now());

        return warehouseRepository.save(warehouse);
    }

    @Override
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(id, Warehouse.class));

        warehouseRepository.delete(warehouse);
    }

    @Override
    public List<Warehouse> getWarehousesByCompany(Long companyId) {
        return warehouseRepository.findByCompanyId(companyId);
    }
}