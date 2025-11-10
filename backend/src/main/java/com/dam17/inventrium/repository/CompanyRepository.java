package com.dam17.inventrium.repository;

import org.springframework.data.repository.CrudRepository;

import com.dam17.inventrium.entity.Company;

public interface CompanyRepository extends CrudRepository<Company, Long> {
    
}
