/**
 * PortKey — Shared Type Definitions
 *
 * These enums are the single source of truth for status values
 * used across the Next.js frontend and Spring Boot backend.
 */
export declare enum ShipmentStatus {
    ARRIVED = "ARRIVED",
    LODGED = "LODGED",
    UNDER_ASSESSMENT = "UNDER_ASSESSMENT",
    PAYMENT_PENDING = "PAYMENT_PENDING",
    RELEASED = "RELEASED"
}
export declare enum LaneStatus {
    NONE = "NONE",
    GREEN = "GREEN",
    YELLOW = "YELLOW",
    RED = "RED"
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    BROKER = "BROKER",
    VIEWER = "VIEWER",
    CLIENT = "CLIENT"
}
export declare enum DocumentType {
    BILL_OF_LADING = "BILL_OF_LADING",
    COMMERCIAL_INVOICE = "COMMERCIAL_INVOICE",
    PACKING_LIST = "PACKING_LIST",
    PERMIT = "PERMIT",
    CERTIFICATE_OF_ORIGIN = "CERTIFICATE_OF_ORIGIN",
    OTHER = "OTHER"
}
export declare enum OcrStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare enum DemurrageUrgency {
    SAFE = "SAFE",
    WARNING = "WARNING",
    CRITICAL = "CRITICAL",
    OVERDUE = "OVERDUE"
}
export declare enum OrgPlan {
    STARTER = "STARTER",
    PRO = "PRO",
    BUSINESS = "BUSINESS",
    ENTERPRISE = "ENTERPRISE"
}
//# sourceMappingURL=index.d.ts.map