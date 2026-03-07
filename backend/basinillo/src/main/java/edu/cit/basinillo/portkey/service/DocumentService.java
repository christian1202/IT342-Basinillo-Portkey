package edu.cit.basinillo.portkey.service;

import edu.cit.basinillo.portkey.entity.Document;
import edu.cit.basinillo.portkey.entity.Shipment;
import edu.cit.basinillo.portkey.entity.User;
import edu.cit.basinillo.portkey.enums.DocumentType;
import edu.cit.basinillo.portkey.exception.ResourceNotFoundException;
import edu.cit.basinillo.portkey.repository.DocumentRepository;
import edu.cit.basinillo.portkey.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Document service — manages document metadata for the Document Vault.
 * Actual file storage (Cloudflare R2) is a placeholder; this service
 * handles the database record and ownership checks.
 */
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ShipmentRepository shipmentRepository;

    @Transactional
    public Document saveDocumentMetadata(Long shipmentId, String fileName, String fileUrl,
                                         DocumentType type, Long sizeBytes, User currentUser) {
        Shipment shipment = findShipmentOrThrow(shipmentId);
        verifyOwnership(shipment, currentUser);

        Document document = Document.builder()
                .shipment(shipment)
                .fileName(fileName)
                .fileUrl(fileUrl)
                .type(type)
                .sizeBytes(sizeBytes)
                .build();

        return documentRepository.save(document);
    }

    public List<Document> getDocumentsByShipment(Long shipmentId, User currentUser) {
        Shipment shipment = findShipmentOrThrow(shipmentId);
        verifyOwnership(shipment, currentUser);
        return documentRepository.findByShipmentId(shipmentId);
    }

    // ── Private helpers (reused from ShipmentService pattern) ─

    private Shipment findShipmentOrThrow(Long shipmentId) {
        return shipmentRepository.findByIdAndDeletedAtIsNull(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found: " + shipmentId));
    }

    private void verifyOwnership(Shipment shipment, User user) {
        if (!shipment.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have access to this shipment's documents");
        }
    }
}
