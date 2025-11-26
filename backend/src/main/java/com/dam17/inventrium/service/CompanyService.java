package com.dam17.inventrium.service;

import java.util.List;

import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;

public interface CompanyService {
    Company getCompany(Long id);
    Company saveCompany(Company company, User creator);
    void deleteCompany(Long id);
    List<User> getUsers(Long id);
    Company joinCompany(String cui, String authPassword, User user);
}
