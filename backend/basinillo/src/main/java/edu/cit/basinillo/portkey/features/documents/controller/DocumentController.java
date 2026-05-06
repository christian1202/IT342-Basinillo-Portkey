package edu.cit.basinillo.portkey.features.documents.controller;

import edu.cit.basinillo.portkey.features.auth.entity.User;
import edu.cit.basinillo.portkey.features.documents.entity.Document;
import edu.cit.basinillo.portkey.features.documents.enums.DocumentType;
import edu.cit.basinillo.portkey.features.documents.service.DocumentService;
import edu.cit.basinillo.portkey.shared.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipments/{shipmentId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    public ResponseEntity<ApiResponse<Document>> upload(
            @PathVariable Long shipmentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType,
            @AuthenticationPrincipal User user) {
        String fileUrl = "https://r2.placeholder.com/" + file.getOriginalFilename();
        Document document = documentService.saveDocumentMetadata(
                shipmentId, file.getOriginalFilename(), fileUrl,
                documentType, file.getSize(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(document));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Document>>> list(
            @PathVariable Long shipmentId,
            @AuthenticationPrincipal User user) {
        List<Document> documents = documentService.getDocumentsByShipment(shipmentId, user);
        return ResponseEntity.ok(ApiResponse.success(documents));
    }
}
