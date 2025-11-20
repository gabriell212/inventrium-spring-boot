package com.dam17.inventrium.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dam17.inventrium.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
