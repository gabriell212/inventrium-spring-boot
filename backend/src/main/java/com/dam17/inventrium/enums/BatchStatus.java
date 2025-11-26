package com.dam17.inventrium.enums;

public enum BatchStatus {
    AVAILABLE,      // Batch has quantity > 0 and is usable
    EXPIRED,        // Batch has passed expiration date
    QUARANTINED,    // Batch is blocked due to quality/safety issues
    SOLD_OUT        // Batch has 0 quantity, fully consumed
}
