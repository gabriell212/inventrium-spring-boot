package com.dam17.inventrium;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dam17.inventrium.entity.Company;
import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.enums.RoleType;
import com.dam17.inventrium.repository.CompanyRepository;
import com.dam17.inventrium.repository.UserRepository;
import com.dam17.inventrium.service.CompanyService;

import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class CompanyServiceIntegrationTest {
    
    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;


    @Test
    void testSaveCompanyAssignsOwnerAndRole() {
        // Arrange: create a new user (the company creator)
        User creator = new User();
        creator.setFirstName("Gabriel");
        creator.setLastName("Rotariu");
        creator.setUsername("gabriell212");
        creator.setEmail("rotariu576@gmail.com");
        creator.setPassword("1234");

        // Print debug info about the user being created
        System.out.println(">>> Creating user: "
            + creator.getFirstName() + " " + creator.getLastName()
            + ", username=" + creator.getUsername()
            + ", email=" + creator.getEmail());

        // Save the user to the database
        userRepository.save(creator);
        System.out.println(">>> User saved to DB with id=" + creator.getId());

        // Arrange: create a new company
        Company company = new Company();
        company.setName("Alfa SRL");
        company.setCui("RO123456");
        company.setRegistrationNumber("J40/123/2025");
        company.setEmail("alfasrl@gmail.com");
        company.setPhone("0712345678");
        company.setAddress("Iasi, Romania");
        company.setAuthPassword("secret");

        // Print debug info about the company being created
        System.out.println(">>> Creating company: "
            + company.getName()
            + ", CUI=" + company.getCui()
            + ", RegNo=" + company.getRegistrationNumber()
            + ", email=" + company.getEmail());

        // Act: save the company with the creator as owner
        Company savedCompany = companyService.saveCompany(company, creator);

        // Print debug info about the saved company
        System.out.println(">>> Company saved: id=" + savedCompany.getId()
            + ", name=" + savedCompany.getName()
            + ", owner=" + savedCompany.getOwner().getUsername()
            + ", createdAt=" + savedCompany.getCreatedAt()
            + ", isActive=" + savedCompany.getIsActive());

        // Assert: verify company fields are set correctly
        assertNotNull(savedCompany.getId());
        assertEquals("Alfa SRL", savedCompany.getName());
        assertEquals("gabriell212", savedCompany.getOwner().getUsername());
        assertTrue(savedCompany.getIsActive(), "Company should be active by default");
        assertNotNull(savedCompany.getCreatedAt(), "CreatedAt should be set automatically");

        // Fetch the updated creator from the DB
        User updatedCreator = userRepository.findById(creator.getId()).orElseThrow();

        // Print debug info about the updated creator after company save
        System.out.println(">>> Updated creator after company save: id=" + updatedCreator.getId()
            + ", username=" + updatedCreator.getUsername()
            + ", role=" + updatedCreator.getRole()
            + ", companyId=" + (updatedCreator.getCompany() != null ? updatedCreator.getCompany().getId() : null));

        // Assert: verify creator role and company assignment
        assertEquals(RoleType.ADMINISTRATOR, updatedCreator.getRole(), "Creator should become ADMINISTRATOR");
        assertEquals(savedCompany.getId(), updatedCreator.getCompany().getId());
    }

    @Test
    void testDeleteCompanyDetachesUsers() {
        // Arrange: create owner
        User owner = new User();
        owner.setFirstName("Gabriel");
        owner.setLastName("Rotariu");
        owner.setUsername("gabriell212");
        owner.setEmail("rotariu576@gmail.com");
        owner.setPassword("1234");

        System.out.println(">>> Creating owner: "
            + owner.getFirstName() + " " + owner.getLastName()
            + ", username=" + owner.getUsername()
            + ", email=" + owner.getEmail());

        userRepository.save(owner);
        System.out.println(">>> Owner saved to DB with id=" + owner.getId());

        // Arrange: create company
        Company company = new Company();
        company.setName("Alfa SRL");
        company.setCui("RO123456");
        company.setRegistrationNumber("J40/123/2025");
        company.setEmail("alfasrl@gmail.com");
        company.setPhone("0712345678");
        company.setAddress("Iasi, Romania");
        company.setAuthPassword("secret");

        System.out.println(">>> Creating company: "
            + company.getName()
            + ", CUI=" + company.getCui()
            + ", RegNo=" + company.getRegistrationNumber()
            + ", email=" + company.getEmail());

        Company savedCompany = companyService.saveCompany(company, owner);

        System.out.println(">>> Company saved: id=" + savedCompany.getId()
            + ", name=" + savedCompany.getName()
            + ", owner=" + savedCompany.getOwner().getUsername()
            + ", createdAt=" + savedCompany.getCreatedAt()
            + ", isActive=" + savedCompany.getIsActive());

        // Act: delete company
        companyService.deleteCompany(savedCompany.getId());
        System.out.println(">>> Company deleted: id=" + savedCompany.getId());

        // Assert: company should be gone
        boolean companyExists = companyRepository.findById(savedCompany.getId()).isPresent();
        System.out.println(">>> Checking if company still exists: " + companyExists);
        assertFalse(companyExists, "Company should be deleted");

        // Assert: owner should be detached
        User updatedOwner = userRepository.findById(owner.getId()).orElseThrow();
        System.out.println(">>> Updated owner after company deletion: id=" + updatedOwner.getId()
            + ", username=" + updatedOwner.getUsername()
            + ", role=" + updatedOwner.getRole()
            + ", company=" + updatedOwner.getCompany());
        assertNull(updatedOwner.getCompany(), "Owner should be detached from company");
        assertEquals(RoleType.PENDING, updatedOwner.getRole(), "Owner should revert to PENDING after deletion");
    }

}
