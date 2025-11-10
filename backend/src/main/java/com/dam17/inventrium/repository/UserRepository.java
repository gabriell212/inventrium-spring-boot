package com.dam17.inventrium.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.dam17.inventrium.entity.User;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
