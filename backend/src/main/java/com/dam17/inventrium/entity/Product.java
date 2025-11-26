package com.dam17.inventrium.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "products")
public class Product {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Product name cannot be blank")
    @NonNull
    @Column(name = "name", nullable = false)
    private String name;
    /*
    Stock Keeping Unit.
    Example: If we sell a blue Nike running shoe, size 10, for men
    SKU: SH-NIKE-M-10-BLUE-RUN
    */
    // Will be inputed by user, as each company has its own policy of assigning SKUs

    @NotBlank(message = "SKU cannot be blank")
    @NonNull
    @Column(name = "sku", nullable = false)
    private String sku;

    @NotBlank(message = "Description cannot be blank")
    @NonNull
    @Column(name = "description", nullable = false)
    private String description;

    @DecimalMin(value = "0.0", inclusive = true, message = "Purchase price must be non-negative")
    @NonNull
    @Column(name = "purchase_price", nullable = false)
    private Double purchasePrice;

    @DecimalMin(value = "0.0", inclusive = true, message = "Base price must be non-negative")
    @NonNull
    @Column(name = "base_price")
    private Double basePrice;

    @NotNull(message = "Batch tracking selection is required")
    @NonNull
    @Column(name = "requires_batch_tracking")
    private Boolean requiresBatchTracking;
    
    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updatedAt", nullable = false)
    private LocalDateTime updatedAt;

    /* Relations */
    
    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "id")
    private User updatedBy;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    /* Methods */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
