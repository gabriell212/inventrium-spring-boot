package com.dam17.inventrium.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    
    private UserRepository userRepository;

    @Override
    public User getUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        return unwrapUser(user, id);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    static User unwrapUser(Optional<User> entity, Long id) {
        if(entity.isPresent())
            return entity.get();
        else
            throw new EntityNotFoundException();
    }
}
