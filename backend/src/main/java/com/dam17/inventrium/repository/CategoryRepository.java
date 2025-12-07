package com.dam17.inventrium.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    List<Category> findByCompanyId(Long companyId);
}
