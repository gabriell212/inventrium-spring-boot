package com.dam17.inventrium.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dam17.inventrium.annotation.CompanyRestricted;
import com.dam17.inventrium.dto.ProductUpdateDto;
import com.dam17.inventrium.entity.Category;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.Product;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.security.JwtUtils;
import com.dam17.inventrium.security.SecurityConstants;
import com.dam17.inventrium.service.CatalogService;
import com.dam17.inventrium.service.CompanyService;
import com.dam17.inventrium.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@AllArgsConstructor
@RestController
@RequestMapping("/companies/{companyId}/catalog")
public class CatalogController {

    private CatalogService catalogService;
    private UserService userService;
    private CompanyService companyService;
    private JwtUtils jwtUtils;

    /* Products */
    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER') or hasRole('OPERATOR')")
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return new ResponseEntity<>(catalogService.getProduct(id), HttpStatus.OK);
    }
    

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product, @PathVariable Long companyId, HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User createdBy = userService.getUser(userId);

        Company company = companyService.getCompany(companyId);

        Product savedProduct = catalogService.saveProduct(product, createdBy, company);

        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@Valid @RequestBody ProductUpdateDto dto, @PathVariable Long id, HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User updatedBy = userService.getUser(userId);

        Product updatedProduct = catalogService.updateProduct(id, dto, updatedBy);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<HttpStatus> deleteProduct(@PathVariable Long id, HttpServletRequest request) {
        catalogService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    
    /* Categories */
    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER') or hasRole('OPERATOR')")
    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        return new ResponseEntity<>(catalogService.getCategory(id), HttpStatus.OK);
    }
    

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category, @PathVariable Long companyId, HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User createdBy = userService.getUser(userId);

        Company company = companyService.getCompany(companyId);

        Category savedCategory = catalogService.saveCategory(category, createdBy, company);

        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@Valid @RequestBody Category category, @PathVariable Long id, HttpServletRequest request) {
        String token = request.getHeader(SecurityConstants.AUTHORIZATION).replace(SecurityConstants.BEARER, "");

        Long userId = jwtUtils.extractUserId(token);
        User updatedBy = userService.getUser(userId);

        Category updatedCategory = catalogService.updateCategory(id, category, updatedBy);

        return ResponseEntity.ok(updatedCategory);
    }

    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<HttpStatus> deleteCategory(@PathVariable Long id, HttpServletRequest request) {
        catalogService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @CompanyRestricted(companyIdParam = "companyId")
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @GetMapping("/categories/{categoryId}/products")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = catalogService.getProductsByCategory(categoryId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    
}
