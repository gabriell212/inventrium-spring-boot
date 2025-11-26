package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import com.dam17.inventrium.enums.BatchStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "batches")
public class Batch {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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
    @Column(name = "status", nullable = false)
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

    /* Relations */

    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", referencedColumnName = "id")
    private Warehouse warehouse;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    /* Methods */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if(this.batchStatus == null) {
            this.batchStatus = BatchStatus.AVAILABLE;
        }
    }
}
