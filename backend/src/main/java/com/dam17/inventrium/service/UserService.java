package com.dam17.inventrium.service;

import com.dam17.inventrium.entity.User;
import com.dam17.inventrium.enums.RoleType;

public interface UserService {
    User getUser(Long id);
    User getUser(String username);
    User saveUser(User user);
    void deleteUser(Long id);
    
    User updateUserRole(Long userId, RoleType newRole);
    void removeUserFromCompany(Long userId);
}
