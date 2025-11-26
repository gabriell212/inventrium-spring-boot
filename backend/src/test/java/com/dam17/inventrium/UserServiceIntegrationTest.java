package com.dam17.inventrium;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.enums.RoleType;
import com.dam17.inventrium.repository.UserRepository;
import com.dam17.inventrium.service.UserService;

import jakarta.transaction.Transactional;
@SpringBootTest
@Transactional
public class UserServiceIntegrationTest {
    
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUserAndGetUserById() {
        User user = new User();
        user.setFirstName("Gabriel");
        user.setLastName("Rotariu");
        user.setUsername("gabriell212");
        user.setEmail("rotariu576@gmail.com");
        user.setPassword("1234");
        
        User saved = userService.saveUser(user);
        System.out.println(">>> User added: id=" + saved.getId()
            + ", username=" + saved.getUsername()
            + ", encodedPassword=" + saved.getPassword());


        assertNotNull(saved.getId(), "User ID should be generated");
        assertNotEquals("1234", saved.getPassword(), "Password should be encoded");
        assertTrue(saved.getPassword().startsWith("$2a$"), "Password should be a Bcrypt hash");

        User fetched = userService.getUser(saved.getId());
        System.out.println(">>> User received: id=" + fetched.getId()
            + ", username=" + fetched.getUsername()
            + ", role=" + fetched.getRole()
            + ", active=" + fetched.getIsActive()
            + ", createdAt=" + fetched.getCreatedAt());

        assertEquals("gabriell212", fetched.getUsername());
        assertEquals("Gabriel", fetched.getFirstName());
        assertEquals(RoleType.PENDING, fetched.getRole());
        assertTrue(fetched.getIsActive(), "User should be active by default");
        assertNotNull(fetched.getCreatedAt(), "Created at should be set automatically");
    }

    @Test
    void testDeleteUser() {
        User user = new User();
        user.setFirstName("To");
        user.setLastName("Delete");
        user.setUsername("deleteMe");
        user.setEmail("delete@example.com");
        user.setPassword("secret");
        user.setRole(RoleType.PENDING);

        User saved = userService.saveUser(user);
        Long id = saved.getId();

        System.out.println(">>> User added: id=" + id
            + ", username=" + saved.getUsername()
            + ", email=" + saved.getEmail()
            + ", encodedPassword=" + saved.getPassword());

        userService.deleteUser(id);
        System.out.println(">>> User with id=" + id + " deleted from DB");

        boolean exists = userRepository.findById(id).isPresent();
        System.out.println(">>> Checking if user still exists: " + exists);

        assertFalse(exists, "User should be deleted from DB");
    }
}
