package com.dam17.inventrium.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCui(String cui);
}
