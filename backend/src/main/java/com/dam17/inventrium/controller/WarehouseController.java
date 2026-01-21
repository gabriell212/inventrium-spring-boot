package com.dam17.inventrium.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.dam17.inventrium.annotation.CompanyRestricted;
import com.dam17.inventrium.dto.warehouse.WarehouseCreateDto;
import com.dam17.inventrium.dto.warehouse.WarehouseDetailsDto;
import com.dam17.inventrium.dto.warehouse.WarehouseUpdateDto;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.entity.Warehouse;
import com.dam17.inventrium.security.JwtUtils;
import com.dam17.inventrium.security.SecurityConstants;
import com.dam17.inventrium.service.CompanyService;
import com.dam17.inventrium.service.UserService;
import com.dam17.inventrium.service.WarehouseService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/companies/{companyId}/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;
    private final UserService userService;
    private final CompanyService companyService;
    private final JwtUtils jwtUtils;

    /* -------------------- CREATE -------------------- */

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<WarehouseDetailsDto> createWarehouse(
            @Valid @RequestBody WarehouseCreateDto dto,
            @PathVariable Long companyId,
            HttpServletRequest request) {

        String token = request.getHeader(SecurityConstants.AUTHORIZATION)
                .replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User createdBy = userService.getUser(userId);

        Company company = companyService.getCompany(companyId);

        Warehouse saved = warehouseService.createWarehouse(dto, createdBy, company);

        WarehouseDetailsDto response = mapToDetailsDto(saved);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /* -------------------- UPDATE -------------------- */

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<WarehouseDetailsDto> updateWarehouse(
            @Valid @RequestBody WarehouseUpdateDto dto,
            @PathVariable Long id,
            HttpServletRequest request) {

        String token = request.getHeader(SecurityConstants.AUTHORIZATION)
                .replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User updatedBy = userService.getUser(userId);

        Warehouse updated = warehouseService.updateWarehouse(id, dto, updatedBy);

        return ResponseEntity.ok(mapToDetailsDto(updated));
    }

    /* -------------------- DELETE -------------------- */

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteWarehouse(@PathVariable Long id) {
        warehouseService.deleteWarehouse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    /* -------------------- GET ONE -------------------- */

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER') or hasRole('OPERATOR')")
    @GetMapping("/{id}")
    public ResponseEntity<WarehouseDetailsDto> getWarehouse(@PathVariable Long id) {
        Warehouse warehouse = warehouseService.getWarehouse(id);
        return ResponseEntity.ok(mapToDetailsDto(warehouse));
    }

    /* -------------------- GET ALL -------------------- */

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER') or hasRole('OPERATOR')")
    @GetMapping
    public ResponseEntity<List<WarehouseDetailsDto>> getWarehouses(@PathVariable Long companyId) {

        List<Warehouse> warehouses = warehouseService.getWarehousesByCompany(companyId);

        List<WarehouseDetailsDto> dtos = warehouses.stream()
                .map(this::mapToDetailsDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    /* -------------------- MAPPER -------------------- */

    private WarehouseDetailsDto mapToDetailsDto(Warehouse w) {
        WarehouseDetailsDto dto = new WarehouseDetailsDto();

        dto.setId(w.getId());
        dto.setCode(w.getCode());
        dto.setName(w.getName());
        dto.setLocation(w.getLocation());
        dto.setType(w.getType().name());
        dto.setIsActive(w.getIsActive());

        dto.setCreatedAt(w.getCreatedAt());
        dto.setUpdatedAt(w.getUpdatedAt());

        if (w.getCompany() != null)
            dto.setCompanyId(w.getCompany().getId());

        if (w.getCreatedBy() != null)
            dto.setCreatedByUsername(w.getCreatedBy().getUsername());

        if (w.getUpdatedBy() != null)
            dto.setUpdatedByUsername(w.getUpdatedBy().getUsername());

        return dto;
    }
}