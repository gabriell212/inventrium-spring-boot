package com.dam17.inventrium.service;

import com.dam17.inventrium.entity.User;

public interface UserService {
    User getUser(Long id);
    User saveUser(User user);
    void deleteUser(Long id);
}
