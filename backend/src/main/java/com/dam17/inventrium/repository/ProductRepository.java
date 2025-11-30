package com.dam17.inventrium.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.Category;
import com.dam17.inventrium.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
    List<Product> findByCategory(Category category);
}
