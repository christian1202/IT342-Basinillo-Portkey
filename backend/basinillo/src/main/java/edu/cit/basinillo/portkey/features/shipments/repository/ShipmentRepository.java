package edu.cit.basinillo.portkey.features.shipments.repository;

import edu.cit.basinillo.portkey.features.shipments.entity.Shipment;
import edu.cit.basinillo.portkey.features.shipments.enums.ShipmentLane;
import edu.cit.basinillo.portkey.features.shipments.enums.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    List<Shipment> findByUserIdAndDeletedAtIsNullOrderByDoomsdayDateAsc(Long userId);

    List<Shipment> findByUserIdAndStatusAndDeletedAtIsNullOrderByDoomsdayDateAsc(Long userId, ShipmentStatus status);

    List<Shipment> findByUserIdAndLaneAndDeletedAtIsNullOrderByDoomsdayDateAsc(Long userId, ShipmentLane lane);

    Optional<Shipment> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT s FROM Shipment s WHERE s.user.id = :userId AND s.deletedAt IS NULL " +
           "AND (LOWER(s.vesselName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.clientName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(s.containerNumbers) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Shipment> searchByKeyword(@Param("userId") Long userId, @Param("keyword") String keyword);

    long countByUserIdAndDeletedAtIsNull(Long userId);

    long countByUserIdAndStatusAndDeletedAtIsNull(Long userId, ShipmentStatus status);

    List<Shipment> findByDeletedAtIsNullOrderByDoomsdayDateAsc();

    long countByDeletedAtIsNull();

    long countByStatusAndDeletedAtIsNull(ShipmentStatus status);
}
