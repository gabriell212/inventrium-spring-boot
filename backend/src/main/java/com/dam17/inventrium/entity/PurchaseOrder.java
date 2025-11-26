package com.dam17.inventrium.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.dam17.inventrium.enums.PurchaseOrderStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Order number cannot be blank")
    @NonNull
    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @NotNull(message = "Order date cannot be null")
    @NonNull
    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDateTime expectedDeliveryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PurchaseOrderStatus status = PurchaseOrderStatus.PENDING;

    @NotNull(message = "Total amount cannot be null")
    @NonNull
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* Relations */

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User createdBy;

    @JsonIgnore
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderItem> purchaseOrderItems = new ArrayList<>();

    /* Methods */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = PurchaseOrderStatus.PENDING;
        }
    }

    public void recalculateTotal() {
        this.totalAmount = purchaseOrderItems.stream()
            .mapToDouble(PurchaseOrderItem::getSubtotal)
            .sum();
    }
}