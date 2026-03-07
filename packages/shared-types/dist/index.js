"use strict";
/**
 * PortKey — Shared Type Definitions
 *
 * These enums are the single source of truth for status values
 * used across the Next.js frontend and Spring Boot backend.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgPlan = exports.DemurrageUrgency = exports.OcrStatus = exports.DocumentType = exports.UserRole = exports.LaneStatus = exports.ShipmentStatus = void 0;
// ── Shipment Lifecycle Stages ──────────────────────────────────
var ShipmentStatus;
(function (ShipmentStatus) {
    ShipmentStatus["ARRIVED"] = "ARRIVED";
    ShipmentStatus["LODGED"] = "LODGED";
    ShipmentStatus["UNDER_ASSESSMENT"] = "UNDER_ASSESSMENT";
    ShipmentStatus["PAYMENT_PENDING"] = "PAYMENT_PENDING";
    ShipmentStatus["RELEASED"] = "RELEASED";
})(ShipmentStatus || (exports.ShipmentStatus = ShipmentStatus = {}));
// ── BOC Lane Assignment ────────────────────────────────────────
var LaneStatus;
(function (LaneStatus) {
    LaneStatus["NONE"] = "NONE";
    LaneStatus["GREEN"] = "GREEN";
    LaneStatus["YELLOW"] = "YELLOW";
    LaneStatus["RED"] = "RED";
})(LaneStatus || (exports.LaneStatus = LaneStatus = {}));
// ── User Roles (mirrors Clerk org roles) ───────────────────────
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["BROKER"] = "BROKER";
    UserRole["VIEWER"] = "VIEWER";
    UserRole["CLIENT"] = "CLIENT";
})(UserRole || (exports.UserRole = UserRole = {}));
// ── Document Types (Golden Documents + extras) ─────────────────
var DocumentType;
(function (DocumentType) {
    DocumentType["BILL_OF_LADING"] = "BILL_OF_LADING";
    DocumentType["COMMERCIAL_INVOICE"] = "COMMERCIAL_INVOICE";
    DocumentType["PACKING_LIST"] = "PACKING_LIST";
    DocumentType["PERMIT"] = "PERMIT";
    DocumentType["CERTIFICATE_OF_ORIGIN"] = "CERTIFICATE_OF_ORIGIN";
    DocumentType["OTHER"] = "OTHER";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
// ── OCR Processing Status ──────────────────────────────────────
var OcrStatus;
(function (OcrStatus) {
    OcrStatus["PENDING"] = "PENDING";
    OcrStatus["PROCESSING"] = "PROCESSING";
    OcrStatus["COMPLETED"] = "COMPLETED";
    OcrStatus["FAILED"] = "FAILED";
})(OcrStatus || (exports.OcrStatus = OcrStatus = {}));
// ── Demurrage Urgency Levels ───────────────────────────────────
var DemurrageUrgency;
(function (DemurrageUrgency) {
    DemurrageUrgency["SAFE"] = "SAFE";
    DemurrageUrgency["WARNING"] = "WARNING";
    DemurrageUrgency["CRITICAL"] = "CRITICAL";
    DemurrageUrgency["OVERDUE"] = "OVERDUE";
})(DemurrageUrgency || (exports.DemurrageUrgency = DemurrageUrgency = {}));
// ── Organization Plan Tiers ────────────────────────────────────
var OrgPlan;
(function (OrgPlan) {
    OrgPlan["STARTER"] = "STARTER";
    OrgPlan["PRO"] = "PRO";
    OrgPlan["BUSINESS"] = "BUSINESS";
    OrgPlan["ENTERPRISE"] = "ENTERPRISE";
})(OrgPlan || (exports.OrgPlan = OrgPlan = {}));
//# sourceMappingURL=index.js.map