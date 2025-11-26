package com.dam17.inventrium.service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dam17.inventrium.entity.Category;
import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.Product;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.repository.CategoryRepository;
import com.dam17.inventrium.repository.ProductRepository;
import com.dam17.inventrium.util.EntityUnwrapper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class CatalogServiceImpl implements CatalogService{

    ProductRepository productRepository;
    CategoryRepository categoryRepository;

    /* Products */
    @Override
    public Product getProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        return EntityUnwrapper.unwrapEntity(product, id, Product.class);
    }

    @Override
    public Product saveProduct(Product product, User user, Company company) {
        product.setCreatedBy(user);
        product.setCompany(company);
        productRepository.save(product);
        return product;
    }

    @Override
    public Product updateProduct(Long id, Product productData, User updatedBy) {
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(id, Product.class));

        existingProduct.setName(productData.getName());
        existingProduct.setSku(productData.getSku());
        existingProduct.setDescription(productData.getDescription());
        existingProduct.setPurchasePrice(productData.getPurchasePrice());
        existingProduct.setBasePrice(productData.getBasePrice());
        existingProduct.setRequiresBatchTracking(productData.getRequiresBatchTracking());

        existingProduct.setCategory(productData.getCategory());
        existingProduct.setCompany(productData.getCompany());

        existingProduct.setUpdatedBy(updatedBy);
        existingProduct.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(id, Product.class));

        productRepository.delete(existingProduct);
    }


    /* Categories */
    @Override
    public Category getCategory(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return EntityUnwrapper.unwrapEntity(category, id, Category.class);
    }

    @Override
    public Category saveCategory(Category category, User user, Company company) {
        category.setCreatedBy(user);
        category.setCompany(company);
        categoryRepository.save(category);
        return category;
    }

    @Override
    public Category updateCategory(Long id, Category categoryData, User updatedBy) {
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(id, Category.class));

        existingCategory.setName(categoryData.getName());
        existingCategory.setDescription(categoryData.getDescription());

        existingCategory.setUpdatedBy(updatedBy);
        existingCategory.setUpdatedAt(LocalDateTime.now());

        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(id, Category.class));
        
        categoryRepository.delete(existingCategory);
    }

}
