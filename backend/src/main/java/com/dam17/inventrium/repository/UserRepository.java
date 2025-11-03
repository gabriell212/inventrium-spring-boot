package com.dam17.inventrium.repository;

import org.springframework.data.repository.CrudRepository;

import com.dam17.inventrium.entity.User;

public interface UserRepository extends CrudRepository<User, Long> {
    
}
