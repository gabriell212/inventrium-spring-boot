package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.BatchStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
@Table(
    name = "batches",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_batch_product_warehouse",
            columnNames = {"batch_number", "product_id", "warehouse_id"}
        )
    }
)
public class Batch {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Batch number cannot be blank")
    @NonNull
    @Column(name = "batch_number", nullable = false)
    private String batchNumber;

    @Min(value = 0, message = "Quantity must be non-negative")
    @NonNull
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    @NonNull
    @Column(name = "cost_price", nullable = false)
    private Double costPrice;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false,
        columnDefinition = "VARCHAR(20) DEFAULT 'AVAILABLE'"
    )
    private BatchStatus batchStatus;

    @PastOrPresent(message = "Received date cannot be in the future")
    @Column(name = "received_date")
    private LocalDateTime receivedDate;

    @PastOrPresent(message = "Manufacturing date cannot be in the future")
    @Column(name = "manufacturing_date")
    private LocalDateTime manufacturingDate;

    @Future(message = "Expiration date must be in the future")
    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /* Relations */

    @ManyToOne(optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    @NonNull
    private Company company;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @NonNull
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @ManyToOne(optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    @NonNull
    private Warehouse warehouse;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    @NonNull
    private Product product;

    /* Methods */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.batchStatus == null) {
            this.batchStatus = BatchStatus.AVAILABLE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}