package com.it342.basinillo.controller;

import com.it342.basinillo.dto.ApiResponse;
import com.it342.basinillo.entity.Document;
import com.it342.basinillo.entity.User;
import com.it342.basinillo.enums.DocumentType;
import com.it342.basinillo.service.DocumentService;
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

    /**
     * Upload a document for a shipment.
     * NOTE: Actual R2 storage is a placeholder — the file URL is stubbed.
     * In production, upload to Cloudflare R2 first, then save the returned URL.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Document>> upload(
            @PathVariable Long shipmentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") DocumentType documentType,
            @AuthenticationPrincipal User user) {

        // Placeholder: in production, upload to R2 and get the real URL
        String fileUrl = "https://r2.placeholder.com/" + file.getOriginalFilename();

        Document document = documentService.saveDocumentMetadata(
                shipmentId,
                file.getOriginalFilename(),
                fileUrl,
                documentType,
                file.getSize(),
                user
        );

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
