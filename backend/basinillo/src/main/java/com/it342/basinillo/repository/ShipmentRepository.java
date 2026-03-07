package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Shipment;
import com.it342.basinillo.enums.ShipmentLane;
import com.it342.basinillo.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    /** Broker-scoped: find all non-deleted shipments for a specific user */
    List<Shipment> findByUserIdAndDeletedAtIsNullOrderByDoomsdayDateAsc(Long userId);

    /** Admin-scoped: find all non-deleted shipments globally */
    List<Shipment> findByDeletedAtIsNullOrderByDoomsdayDateAsc();

    /** Single shipment by ID, only if not soft-deleted */
    Optional<Shipment> findByIdAndDeletedAtIsNull(Long id);

    /** Search by vessel name OR client name, broker-scoped */
    @Query("SELECT s FROM Shipment s WHERE s.user.id = :userId AND s.deletedAt IS NULL " +
           "AND (LOWER(s.vesselName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(s.clientName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "  OR LOWER(s.containerNumbers) LIKE LOWER(CONCAT('%', :keyword, '%')))" +
           " ORDER BY s.doomsdayDate ASC")
    List<Shipment> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    /** Filter by status, broker-scoped */
    List<Shipment> findByUserIdAndStatusAndDeletedAtIsNullOrderByDoomsdayDateAsc(Long userId, ShipmentStatus status);

    /** Filter by lane, broker-scoped */
    List<Shipment> findByUserIdAndLaneAndDeletedAtIsNullOrderByDoomsdayDateAsc(Long userId, ShipmentLane lane);

    /** Counting helpers for analysis */
    long countByUserIdAndDeletedAtIsNull(Long userId);

    long countByUserIdAndStatusAndDeletedAtIsNull(Long userId, ShipmentStatus status);

    /** Admin counts */
    long countByDeletedAtIsNull();

    long countByStatusAndDeletedAtIsNull(ShipmentStatus status);
}
