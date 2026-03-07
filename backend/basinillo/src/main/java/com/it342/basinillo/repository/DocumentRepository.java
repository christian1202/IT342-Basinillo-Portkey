package com.it342.basinillo.repository;

import com.it342.basinillo.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByShipmentId(Long shipmentId);
}
