package com.dam17.inventrium.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sales_order_items")
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class SalesOrderItem {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
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

    @Column(name = "discount")
    private Double discount = 0.0;

    @Column(name = "subtotal", nullable = false)
    private Double subtotal;

    /* Relations */

    @ManyToOne
    @JoinColumn(name = "sales_order_id", referencedColumnName = "id")
    private SalesOrder salesOrder;

    @ManyToOne
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    private Batch batch;

    /* Methods */

    @PrePersist
    protected void onCreate() {
        // Calculate subtotal before persisting
        double effectivePrice = unitPrice * quantity;
        if (discount != null && discount > 0) {
            effectivePrice -= discount;
        }
        this.subtotal = effectivePrice;
    }
}