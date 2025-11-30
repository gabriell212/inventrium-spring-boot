package com.dam17.inventrium.service;

import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.enums.RoleType;
import com.dam17.inventrium.exception.EntityNotFoundException;
import com.dam17.inventrium.repository.UserRepository;
import com.dam17.inventrium.util.EntityUnwrapper;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    
    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return EntityUnwrapper.unwrapEntity(user, id, User.class);
    }

    @Override
    public User getUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return EntityUnwrapper.unwrapEntity(user, User.class);
    }

    @Override
    public User saveUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User updateUserRole(Long userId, RoleType newRole) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException(userId, User.class));
        
        user.setRole(newRole);
        return userRepository.save(user);
    }
}
