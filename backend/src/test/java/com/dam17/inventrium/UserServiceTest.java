package com.dam17.inventrium;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.repository.UserRepository;
import com.dam17.inventrium.service.UserServiceImpl;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    // Check if saveUser method correctly encodes user's password
    @Test
    public void testSaveUserEncodesPassword() {
        User user = new User();
        user.setPassword("plain");

        when(bCryptPasswordEncoder.encode("plain")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.saveUser(user);
        assertEquals("encoded", result.getPassword());
    }

    // Check if getUser method works when given a correct username
    @Test
    public void testGetUserByUsernameExists() {
        User user = new User();
        user.setUsername("gabriel");
        when(userRepository.findByUsername("gabriel")).thenReturn(Optional.of(user));

        User result = userService.getUser("gabriel");
        assertEquals("gabriel", result.getUsername());
    }

    // Check if getUser method works when given an incorrect username
    @Test
    public void testGetUserByUsernameNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.getUser("unknown"));
    }

    // Check if saveUser method preserves the username and encodes the password correctly
    @Test
    public void testSaveUserPreservesFields() {
        User user = new User();
        user.setUsername("Vica");
        user.setPassword("plain");

        when(bCryptPasswordEncoder.encode("plain")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User result = userService.saveUser(user);
        assertEquals("Vica", result.getUsername());
        assertEquals("encoded", result.getPassword());
    }
}
