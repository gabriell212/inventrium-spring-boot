package com.dam17.inventrium.service;

import java.util.List;

import com.dam17.inventrium.dto.ProductUpdateDto;
import com.dam17.inventrium.entity.Category;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.Product;
import com.dam17.inventrium.entity.User;

public interface CatalogService {
    /* Products */
    Product getProduct(Long id);
    Product saveProduct(Product product, User user, Company company);
    Product updateProduct(Long id, ProductUpdateDto dto, User updatedBy);
    void deleteProduct(Long id);

    /* Categories */
    Category getCategory(Long id);
    Category saveCategory(Category category, User user, Company company);
    Category updateCategory(Long id, Category categoryData, User updatedBy);
    void deleteCategory(Long id);
    List<Product> getProductsByCategory(Long categoryId);
}
