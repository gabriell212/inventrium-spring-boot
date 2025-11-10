package com.dam17.inventrium.util;

import java.util.Optional;

import com.dam17.inventrium.exception.EntityNotFoundException;

public class EntityUnwrapper {
    public static <T> T unwrapEntity(Optional<T> optional, Long id, Class<?> entityClass) {
        return optional.orElseThrow(() -> 
            new EntityNotFoundException(id, entityClass));
    }

    public static <T> T unwrapEntity(Optional<T> optional, Class<?> entityClass) {
        return optional.orElseThrow(() -> 
            new EntityNotFoundException(entityClass));
    }
}
