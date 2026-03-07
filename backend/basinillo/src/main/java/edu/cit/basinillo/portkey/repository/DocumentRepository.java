package edu.cit.basinillo.portkey.repository;

import edu.cit.basinillo.portkey.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByShipmentId(Long shipmentId);
}
