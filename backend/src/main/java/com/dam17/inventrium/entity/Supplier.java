package com.dam17.inventrium.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "suppliers")
public class Supplier {

    /* Properties */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Supplier name cannot be blank")
    @NonNull
    @Column(name = "name", nullable = false)
    private String name;

    @Email(message = "Invalid email format")
    @NonNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotBlank(message = "Phone number cannot be blank")
    @NonNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @NotBlank(message = "Address cannot be blank")
    @NonNull
    @Column(name = "address", nullable = false)
    private String address;

    @NotBlank(message = "Tax ID cannot be blank")
    @NonNull
    @Column(name = "tax_id", nullable = false)
    private String taxId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /* Relations */
    @ManyToOne
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User createdBy;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrder> purchaseOrders = new ArrayList<>();

    /* Methods */

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}