package com.dam17.inventrium.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dam17.inventrium.dto.batch.BatchCreateDto;
import com.dam17.inventrium.dto.batch.BatchDetailsDto;
import com.dam17.inventrium.dto.batch.BatchUpdateDto;
import com.dam17.inventrium.entity.Batch;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.security.JwtUtils;
import com.dam17.inventrium.security.SecurityConstants;
import com.dam17.inventrium.service.BatchService;
import com.dam17.inventrium.service.CompanyService;
import com.dam17.inventrium.service.InventoryService;
import com.dam17.inventrium.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/companies/{companyId}/inventory/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;
    private final InventoryService inventoryService;
    private final CompanyService companyService;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    // -----------------------------
    // GET ALL BATCHES
    // -----------------------------
    @GetMapping
    public ResponseEntity<List<BatchDetailsDto>> getAllBatches(@PathVariable Long companyId) {

        List<Batch> batches = batchService.getAllBatchesForCompany(companyId);

        List<BatchDetailsDto> dtos = batches.stream()
                .map(this::mapToDetailsDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    // -----------------------------
    // GET BATCH DETAILS
    // -----------------------------
    @GetMapping("/{batchId}")
    public ResponseEntity<BatchDetailsDto> getBatch(
            @PathVariable Long companyId,
            @PathVariable Long batchId) {

        Batch batch = batchService.getBatch(batchId);

        if (!batch.getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(mapToDetailsDto(batch));
    }

    // -----------------------------
    // CREATE BATCH
    // -----------------------------
    @PostMapping
    public ResponseEntity<BatchDetailsDto> createBatch(
            @PathVariable Long companyId,
            @RequestBody BatchCreateDto dto,
            HttpServletRequest request) {

        String token = request.getHeader(SecurityConstants.AUTHORIZATION)
                .replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User createdBy = userService.getUser(userId);

        Company company = companyService.getCompany(companyId);

        Batch batch = batchService.createBatch(dto, createdBy, company);

        return ResponseEntity.ok(mapToDetailsDto(batch));
    }

    // -----------------------------
    // UPDATE BATCH
    // -----------------------------
    @PutMapping("/{batchId}")
    public ResponseEntity<BatchDetailsDto> updateBatch(
            @PathVariable Long companyId,
            @PathVariable Long batchId,
            @RequestBody BatchUpdateDto dto,
            HttpServletRequest request) {

        String token = request.getHeader(SecurityConstants.AUTHORIZATION)
                .replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User updatedBy = userService.getUser(userId);

        Batch batch = batchService.getBatch(batchId);

        if (!batch.getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(403).build();
        }

        Batch updated = batchService.updateBatch(batchId, dto, updatedBy);

        return ResponseEntity.ok(mapToDetailsDto(updated));
    }

    // -----------------------------
    // DELETE BATCH
    // -----------------------------
    @DeleteMapping("/{batchId}")
    public ResponseEntity<Void> deleteBatch(
            @PathVariable Long companyId,
            @PathVariable Long batchId) {

        Batch batch = batchService.getBatch(batchId);

        if (!batch.getCompany().getId().equals(companyId)) {
            return ResponseEntity.status(403).build();
        }

        batchService.deleteBatch(batchId);

        return ResponseEntity.noContent().build();
    }

    // -----------------------------
    // GET BATCHES BY WAREHOUSE
    // -----------------------------
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<BatchDetailsDto>> getBatchesInWarehouse(
            @PathVariable Long companyId,
            @PathVariable Long warehouseId) {

        List<BatchDetailsDto> dtos = inventoryService.getBatchesInWarehouse(warehouseId);

        return ResponseEntity.ok(dtos);
    }

    // -----------------------------
    // DTO MAPPER
    // -----------------------------
    private BatchDetailsDto mapToDetailsDto(Batch b) {
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
    }
}