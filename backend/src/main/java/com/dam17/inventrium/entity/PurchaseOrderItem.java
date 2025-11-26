package com.dam17.inventrium.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "purchase_order_items")
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class PurchaseOrderItem {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    @NonNull
    @Column(name = "quantity", nullable = false)
    private Double quantity;

    @NotNull(message = "Unit price cannot be null")
    @NonNull
    @Column(name = "unit_price", nullable = false)
    private Double unitPrice;

    @Column(name = "subtotal", nullable = false)
    private Double subtotal;

    /* Relations */

    @ManyToOne
    @JoinColumn(name = "purchase_order_id", referencedColumnName = "id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    private Batch batch;

    /* Methods */

    @PrePersist
    protected void onCreate() {
        this.subtotal = unitPrice * quantity;
    }
}