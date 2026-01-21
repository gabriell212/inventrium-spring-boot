package com.dam17.inventrium.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dam17.inventrium.annotation.CompanyRestricted;
import com.dam17.inventrium.dto.batch.BatchDetailsDto;
import com.dam17.inventrium.dto.inventory.TransferStockRequest;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.security.JwtUtils;
import com.dam17.inventrium.security.SecurityConstants;
import com.dam17.inventrium.service.CompanyService;
import com.dam17.inventrium.service.InventoryService;
import com.dam17.inventrium.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/companies/{companyId}/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final CompanyService companyService;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    // ---------------------------------------------------------
    // GET BATCHES IN WAREHOUSE
    // ---------------------------------------------------------
    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER') or hasRole('OPERATOR')")
    @GetMapping("/warehouses/{warehouseId}/batches")
    public ResponseEntity<List<BatchDetailsDto>> getBatchesInWarehouse(
            @PathVariable Long companyId,
            @PathVariable Long warehouseId) {

        companyService.getCompany(companyId);

        List<BatchDetailsDto> dtos = inventoryService.getBatchesInWarehouse(warehouseId);

        return ResponseEntity.ok(dtos);
    }

    // ---------------------------------------------------------
    // TRANSFER STOCK
    // ---------------------------------------------------------
    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER') or hasRole('OPERATOR')")
    @PostMapping("/transfer")
    public ResponseEntity<Void> transferStock(
            @PathVariable Long companyId,
            @RequestBody TransferStockRequest dto,
            HttpServletRequest request) {

        // Extract user from JWT (same pattern as CatalogController)
        String token = request.getHeader(SecurityConstants.AUTHORIZATION)
                .replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User user = userService.getUser(userId);

        // Validate company
        Company company = companyService.getCompany(companyId);

        // Validate user belongs to company
        if (!user.getCompany().getId().equals(company.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Perform transfer
        inventoryService.transferStockByBatch(
                dto.getBatchId(),
                dto.getFromWarehouseId(),
                dto.getToWarehouseId(),
                dto.getQuantity(),
                user
        );

        return ResponseEntity.ok().build();
    }
}