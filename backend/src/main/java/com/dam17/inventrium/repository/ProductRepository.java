package com.dam17.inventrium.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
    
}
