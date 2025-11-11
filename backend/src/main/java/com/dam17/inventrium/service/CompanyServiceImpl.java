package com.dam17.inventrium.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.enums.RoleType;
import com.dam17.inventrium.repository.CompanyRepository;
import com.dam17.inventrium.repository.UserRepository;
import com.dam17.inventrium.util.EntityUnwrapper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class CompanyServiceImpl implements CompanyService{
    
    private CompanyRepository companyRepository;
    private UserRepository userRepository;

    @Override
    public Company getCompany(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        return EntityUnwrapper.unwrapEntity(company, id, Company.class);
    }

    @Override
    public Company saveCompany(Company company, User creator) {
        company.setOwner(creator);
        Company savedCompany = companyRepository.save(company);

        creator.setCompany(savedCompany);
        creator.setRole(RoleType.ADMINISTRATOR);
        userRepository.save(creator);

        return savedCompany;
    }

    @Override
    public void deleteCompany(Long id) {
        Company company = getCompany(id);

        // Dettach users from company before deleting it
        List<User> users = getUsers(id);
        for(User user : users) {
            user.setCompany(null);
        }
        userRepository.saveAll(users);

        // Dettach owner
        User owner = company.getOwner();
        if(owner != null) {
            company.setOwner(null);
            companyRepository.save(company);
        }
        
        // Delete the company
        companyRepository.deleteById(id);
    }

    @Override
    public List<User> getUsers(Long id) {
        Company company = getCompany(id);
        return company.getUsers();
    }
}
