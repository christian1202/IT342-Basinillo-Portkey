package com.it342.basinillo.entity;

import com.it342.basinillo.enums.ShipmentLane;
import com.it342.basinillo.enums.ShipmentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Ownership ────────────────────────────────────────────

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── Vessel & Voyage ──────────────────────────────────────

    @Column(nullable = false)
    private String vesselName;

    private String voyageNumber;

    private LocalDate arrivalDate;

    private String portOfDischarge;

    // ── Client & Cargo ───────────────────────────────────────

    @Column(nullable = false)
    private String clientName;

    private String containerNumbers;

    private String descriptionOfGoods;

    // ── Demurrage ────────────────────────────────────────────

    @Builder.Default
    private Integer freeDays = 5;

    private LocalDate doomsdayDate;

    // ── Status & Lane ────────────────────────────────────────

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.ARRIVED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ShipmentLane lane = ShipmentLane.GREEN;

    // ── Reference Numbers ────────────────────────────────────

    private String entryNumber;

    private String orNumber;

    // ── Child collections ────────────────────────────────────

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ShipmentItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    // ── Soft delete ──────────────────────────────────────────

    private LocalDateTime deletedAt;

    // ── Timestamps ───────────────────────────────────────────

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
