# PortKey — Software Test Plan
> **Date:** 2026-04-08
> **Version:** 1.0
> **Author:** Christian Jay Basinillo
> **Project:** PortKey — Intelligent Customs Clearance Platform
> **Course:** IT342-G3 System Integration and Architecture, CIT-U

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Scope](#2-scope)
3. [Functional Requirements Coverage](#3-functional-requirements-coverage)
4. [Test Cases](#4-test-cases)
5. [Test Scripts / Test Steps](#5-test-scripts--test-steps)
6. [Automated Test Cases](#6-automated-test-cases)
7. [Test Environment](#7-test-environment)
8. [Test Data](#8-test-data)
9. [Risk Assessment](#9-risk-assessment)

---

## 1. Introduction
This Software Test Plan defines the testing strategy for the PortKey application — a full-stack customs clearance management platform.
It covers all three layers (Backend API, Web Frontend, Mobile Application) and ensures that after the Vertical Slice Architecture refactoring,
all existing features continue to function correctly.

### System Overview
- **Backend:** Spring Boot 3.5 / Java 17 / PostgreSQL (NeonDB) — REST API at `/api/v1`
- **Web Frontend:** Next.js 16 / React 19 / TypeScript / Tailwind CSS
- **Mobile:** Kotlin / Android API 34 / XML layouts / MVVM architecture

---

## 2. Scope

### In Scope
| Layer | What's Tested |
|-------|---------------|
| Backend | Auth (register/login/me), Shipments CRUD, Status lifecycle, Analysis, Admin dashboard, Document metadata, Error handling, Security filters, JWT token flow |
| Web Frontend | Login page, Register page, Dashboard, Shipments list/new/detail/edit/documents, Admin dashboard, Protected routes, JWT interceptor |
| Mobile | Login screen, Register screen, Home/Dashboard screen, JWT encrypted storage, Retrofit API calls |

### Out of Scope
- PayMongo Pro plan upgrade flow (not yet implemented)
- Google OAuth2 (not yet implemented)
- WebSocket real-time updates (not yet implemented)
- FCM push notifications (not yet implemented)
- Cloudflare R2 actual file upload (placeholder)
- Demurrage cron job (not yet implemented)

---

## 3. Functional Requirements Coverage

### FR-AUTH — Authentication Module
| FR-ID | Requirement | Status | Priority |
|-------|------------|--------|----------|
| FR-AUTH-001 | User registration with email, password, firstname, lastname | ✅ Implemented | P0 |
| FR-AUTH-002 | Duplicate email detection on registration | ✅ Implemented | P0 |
| FR-AUTH-003 | User login with email/password, returns JWT access + refresh tokens | ✅ Implemented | P0 |
| FR-AUTH-004 | Invalid credentials return AUTH-001 error | ✅ Implemented | P0 |
| FR-AUTH-005 | GET /auth/me returns authenticated user profile | ✅ Implemented | P0 |
| FR-AUTH-006 | JWT token validation on all protected endpoints | ✅ Implemented | P0 |
| FR-AUTH-007 | Expired token returns AUTH-002 error | ✅ Implemented | P1 |
| FR-AUTH-008 | BCrypt password hashing with cost factor 12 | ✅ Implemented | P0 |
| FR-AUTH-009 | EncryptedSharedPreferences for JWT storage (Mobile) | ✅ Implemented | P0 |
| FR-AUTH-010 | OkHttp3 interceptor attaches Bearer token (Mobile) | ✅ Implemented | P0 |

### FR-SHIPMENT — Shipment Management Module
| FR-ID | Requirement | Status | Priority |
|-------|------------|--------|----------|
| FR-SHIP-001 | Create shipment with vessel, voyage, arrival date, port, client, containers, items | ✅ Implemented | P0 |
| FR-SHIP-002 | List shipments sorted by doomsday date (demurrage urgency) | ✅ Implemented | P0 |
| FR-SHIP-003 | Filter shipments by status (ARRIVED/LODGED/ASSESSED/PAID/RELEASED) | ✅ Implemented | P1 |
| FR-SHIP-004 | Filter shipments by lane (GREEN/YELLOW/RED) | ✅ Implemented | P1 |
| FR-SHIP-005 | Search shipments by keyword | ✅ Implemented | P1 |
| FR-SHIP-006 | View full shipment detail by ID | ✅ Implemented | P0 |
| FR-SHIP-007 | Update shipment fields | ✅ Implemented | P1 |
| FR-SHIP-008 | Advance shipment lifecycle stage (ARRIVED→LODGED→ASSESSED→PAID→RELEASED) | ✅ Implemented | P0 |
| FR-SHIP-009 | Soft delete shipment | ✅ Implemented | P1 |
| FR-SHIP-010 | Broker sees only own shipments | ✅ Implemented | P0 |
| FR-SHIP-011 | Free days calculation and doomsday date | ✅ Implemented | P0 |
| FR-SHIP-012 | Shipment analysis (total, active, completed counts) | ✅ Implemented | P2 |
| FR-SHIP-013 | Demurrage urgency lanes displayed with correct colors | ✅ Implemented | P1 |

### FR-ADMIN — Admin Module
| FR-ID | Requirement | Status | Priority |
|-------|------------|--------|----------|
| FR-ADMIN-001 | Admin sees all shipments across all brokers | ✅ Implemented | P0 |
| FR-ADMIN-002 | Admin sees all registered users | ✅ Implemented | P1 |
| FR-ADMIN-003 | Admin can view user by ID | ✅ Implemented | P1 |
| FR-ADMIN-004 | Access denied for non-admin users (AUTH-003) | ✅ Implemented | P0 |

### FR-DOCUMENT — Document Vault Module
| FR-ID | Requirement | Status | Priority |
|-------|------------|--------|----------|
| FR-DOC-001 | Save document metadata linked to shipment | ✅ Implemented | P1 |
| FR-DOC-002 | List documents by shipment ID | ✅ Implemented | P1 |
| FR-DOC-003 | Ownership verification for document access | ✅ Implemented | P0 |

### FR-SEC — Security Module
| FR-ID | Requirement | Status | Priority |
|-------|------------|--------|----------|
| FR-SEC-001 | CORS allows only portkey.vercel.app and localhost:3000 | ✅ Implemented | P0 |
| FR-SEC-002 | All endpoints (except auth) require Bearer token | ✅ Implemented | P0 |
| FR-SEC-003 | Standard error response wrapper on all errors | ✅ Implemented | P0 |
| FR-SEC-004 | Validation error details returned for invalid requests | ✅ Implemented | P1 |
| FR-SEC-005 | Role-based access control (BROKER vs ADMIN) | ✅ Implemented | P0 |
| FR-SEC-006 | XSS protection and secure headers | ✅ Implemented | P1 |

---

## 4. Test Cases

### TC-AUTH — Authentication Test Cases

| TC-ID | Test Case | FR Covered | Type | Precondition | Input | Expected Result |
|-------|-----------|------------|------|-------------|-------|-----------------|
| TC-AUTH-01 | Register new user successfully | FR-AUTH-001 | Manual + Auto | None | `{"email":"test@example.com","password":"Test@123","firstName":"John","lastName":"Doe"}` | 201 Created, success=true, data contains user + tokens |
| TC-AUTH-02 | Register with duplicate email | FR-AUTH-002 | Auto | User already exists | Same email as existing user | 409 Conflict, error code DB-002 |
| TC-AUTH-03 | Register with missing required fields | FR-AUTH-001 | Auto | None | `{"email":"test@test.com"}` | 400 Bad Request, error code VALID-001 |
| TC-AUTH-04 | Register with invalid email format | FR-AUTH-001 | Auto | None | `{"email":"notanemail","password":"Test@123"}` | 400 Bad Request, error code VALID-001 |
| TC-AUTH-05 | Login with valid credentials | FR-AUTH-003 | Manual + Auto | User registered | `{"email":"test@example.com","password":"Test@123"}` | 200 OK, success=true, data contains user + tokens |
| TC-AUTH-06 | Login with wrong password | FR-AUTH-004 | Auto | User registered | `{"email":"test@example.com","password":"WrongPass"}` | 401 Unauthorized, error code AUTH-001 |
| TC-AUTH-07 | Login with non-existent email | FR-AUTH-004 | Auto | None | `{"email":"nouser@test.com","password":"Test@123"}` | 401 Unauthorized, error code AUTH-001 |
| TC-AUTH-08 | Get current user with valid token | FR-AUTH-005 | Manual + Auto | User logged in | GET /auth/me with Bearer token | 200 OK, data contains email, firstName, lastName, role, plan |
| TC-AUTH-09 | Access protected endpoint without token | FR-AUTH-006 | Auto | None | GET /shipments without Authorization header | 401/403 Unauthorized |
| TC-AUTH-10 | Access protected endpoint with expired token | FR-AUTH-007 | Auto | Token expired | GET /shipments with expired Bearer token | 401 Unauthorized, error code AUTH-002 |
| TC-AUTH-11 | Mobile: Token stored in EncryptedSharedPreferences | FR-AUTH-009 | Manual | Android device | Login via mobile app | Token persisted securely, not in plain text |
| TC-AUTH-12 | Mobile: Bearer token attached to requests | FR-AUTH-010 | Manual | User logged in mobile | GET /shipments from mobile | Authorization header present in request |

### TC-SHIPMENT — Shipment Test Cases

| TC-ID | Test Case | FR Covered | Type | Precondition | Input | Expected Result |
|-------|-----------|------------|------|-------------|-------|-----------------|
| TC-SHIP-01 | Create shipment with minimum required fields | FR-SHIP-001 | Manual + Auto | Authenticated BROKER | `{"vesselName":"Vessel A","clientName":"Client A","portOfDischarge":"Port A"}` | 201 Created, default freeDays=5, status=ARRIVED, lane=GREEN |
| TC-SHIP-02 | Create shipment with all fields + items | FR-SHIP-001 | Auto | Authenticated BROKER | Full shipment with 2 items | 201 Created, all fields saved, items linked |
| TC-SHIP-03 | Create shipment with custom freeDays | FR-SHIP-011 | Auto | Authenticated BROKER | `{"vesselName":"V1","clientName":"C1","freeDays":10,"arrivalDate":"2026-04-10"}` | doomsdayDate = 2026-04-20 |
| TC-SHIP-04 | List shipments (empty for new broker) | FR-SHIP-002 | Auto | Authenticated BROKER with no shipments | GET /shipments | 200 OK, empty array |
| TC-SHIP-05 | List shipments (multiple) sorted by doomsday | FR-SHIP-002 | Auto | BROKER with 3 shipments | GET /shipments | 200 OK, 3 shipments sorted by urgency |
| TC-SHIP-06 | Get shipment by ID (owner) | FR-SHIP-006 | Auto | BROKER owns shipment #1 | GET /shipments/1 | 200 OK, full shipment detail |
| TC-SHIP-07 | Get shipment by ID (not owner) | FR-SHIP-010 | Auto | Another BROKER | GET /shipments/1 (owned by other) | 403 Forbidden |
| TC-SHIP-08 | Get non-existent shipment | FR-SHIP-006 | Auto | Authenticated BROKER | GET /shipments/99999 | 404 Not Found, error DB-001 |
| TC-SHIP-09 | Update shipment fields | FR-SHIP-007 | Auto | BROKER owns shipment #1 | PUT /shipments/1 with updated vesselName | 200 OK, fields updated |
| TC-SHIP-10 | Advance status ARRIVED → LODGED | FR-SHIP-008 | Auto | Shipment status ARRIVED | PATCH /shipments/1/status | 200 OK, status=LODGED |
| TC-SHIP-11 | Advance status through full lifecycle | FR-SHIP-008 | Auto | Shipment status ARRIVED | PATCH ×4 times | ARRIVED→LODGED→ASSESSED→PAID→RELEASED |
| TC-SHIP-12 | Advance status on RELEASED shipment | FR-SHIP-008 | Auto | Shipment status RELEASED | PATCH /shipments/1/status | 500/400, error about already released |
| TC-SHIP-13 | Soft delete shipment | FR-SHIP-009 | Auto | BROKER owns shipment #1 | DELETE /shipments/1 | 200 OK, shipment no longer appears in list |
| TC-SHIP-14 | Get deleted shipment returns 404 | FR-SHIP-009 | Auto | Shipment #1 soft-deleted | GET /shipments/1 | 404 Not Found |
| TC-SHIP-15 | Filter by status | FR-SHIP-003 | Auto | Multiple shipments with different statuses | GET /shipments?status=ARRIVED | Only ARRIVED shipments returned |
| TC-SHIP-16 | Filter by lane | FR-SHIP-004 | Auto | Multiple shipments with different lanes | GET /shipments?lane=RED | Only RED lane shipments returned |
| TC-SHIP-17 | Search by keyword | FR-SHIP-005 | Auto | Shipments with various names | GET /shipments?search=Vessel | Matching shipments returned |
| TC-SHIP-18 | Shipment analysis for broker | FR-SHIP-012 | Auto | BROKER with 5 shipments (3 active, 2 completed) | GET /shipments/analysis | totalShipments=5, activeShipments=3, completedShipments=2 |
| TC-SHIP-19 | Web: Demurrage lane colors correct | FR-SHIP-013 | Manual | Shipments with GREEN/YELLOW/RED lanes | View dashboard | GREEN=#4CAF50, YELLOW=#FF9800, RED=#F44336 |
| TC-SHIP-20 | Mobile: Shipment list displays correctly | FR-SHIP-002 | Manual | Mobile app, logged in, has shipments | Open home screen | Shipments listed with proper labels |

### TC-ADMIN — Admin Test Cases

| TC-ID | Test Case | FR Covered | Type | Precondition | Input | Expected Result |
|-------|-----------|------------|------|-------------|-------|-----------------|
| TC-ADMIN-01 | Admin lists all shipments | FR-ADMIN-001 | Manual + Auto | Authenticated ADMIN | GET /admin/shipments | 200 OK, all brokers' shipments |
| TC-ADMIN-02 | Admin lists all users | FR-ADMIN-002 | Auto | Authenticated ADMIN | GET /admin/users | 200 OK, all registered users |
| TC-ADMIN-03 | Admin gets user by ID | FR-ADMIN-003 | Auto | Authenticated ADMIN | GET /admin/users/1 | 200 OK, user detail |
| TC-ADMIN-04 | Broker accesses admin endpoints | FR-ADMIN-004 | Auto | Authenticated BROKER | GET /admin/shipments | 403 Forbidden, error AUTH-003 |
| TC-ADMIN-05 | Unauthenticated access to admin | FR-SEC-002 | Auto | No token | GET /admin/shipments | 401/403 Unauthorized |
| TC-ADMIN-06 | Web: Admin dashboard loads | FR-ADMIN-001 | Manual | ADMIN logged in web | Navigate to /dashboard/admin | Admin dashboard with all data |
| TC-ADMIN-07 | Web: Broker cannot access admin page | FR-ADMIN-004 | Manual | BROKER logged in web | Navigate to /dashboard/admin | Redirected or access denied |

### TC-DOC — Document Test Cases

| TC-ID | Test Case | FR Covered | Type | Precondition | Input | Expected Result |
|-------|-----------|------------|------|-------------|-------|-----------------|
| TC-DOC-01 | Save document metadata | FR-DOC-001 | Auto | Authenticated BROKER owns shipment #1 | POST document metadata | 201 Created, document record saved |
| TC-DOC-02 | List documents for shipment | FR-DOC-002 | Auto | Documents exist for shipment #1 | GET documents for shipment #1 | 200 OK, list of documents |
| TC-DOC-03 | Access documents of other broker's shipment | FR-DOC-003 | Auto | Another BROKER | GET documents for shipment owned by other | 403 Forbidden |
| TC-DOC-04 | List documents for non-existent shipment | FR-DOC-002 | Auto | Authenticated BROKER | GET documents for shipment #99999 | 404 Not Found |

### TC-WEB — Web Frontend Test Cases

| TC-ID | Test Case | FR Covered | Type | Precondition | Expected Result |
|-------|-----------|------------|------|-------------|-----------------|
| TC-WEB-01 | Login page renders correctly | FR-AUTH-003 | Manual | Navigate to /login | Login form with email/password fields, submit button |
| TC-WEB-02 | Valid login redirects to dashboard | FR-AUTH-003 | Manual | Valid credentials entered | Redirected to /dashboard |
| TC-WEB-03 | Invalid login shows error message | FR-AUTH-004 | Manual | Wrong credentials entered | Error message displayed |
| TC-WEB-04 | Register page renders correctly | FR-AUTH-001 | Manual | Navigate to /register | Registration form with all fields |
| TC-WEB-05 | Register redirects to dashboard | FR-AUTH-001 | Manual | Valid registration data | Redirected to /dashboard |
| TC-WEB-06 | Dashboard shows shipments | FR-SHIP-002 | Manual | Logged in with shipments | Shipment cards/table displayed |
| TC-WEB-07 | Dashboard shows empty state | FR-SHIP-002 | Manual | Logged in, no shipments | Empty state message displayed |
| TC-WEB-08 | Create shipment form works | FR-SHIP-001 | Manual | Navigate to /dashboard/shipments/new | Form submits, redirects to shipment detail |
| TC-WEB-09 | Shipment detail page renders | FR-SHIP-006 | Manual | Click on shipment | Full detail with items, status, lane |
| TC-WEB-10 | Edit shipment works | FR-SHIP-007 | Manual | Click edit on shipment | Form pre-filled, saves updates |
| TC-WEB-11 | Status advance button works | FR-SHIP-008 | Manual | View shipment detail | Button advances to next status |
| TC-WEB-12 | Delete shipment works | FR-SHIP-009 | Manual | View shipment list | Shipment removed after delete |
| TC-WEB-13 | Protected route redirects to login | FR-SEC-002 | Manual | Not logged in, navigate to /dashboard | Redirected to /login |
| TC-WEB-14 | Sidebar navigation works | — | Manual | Logged in | All nav links functional |
| TC-WEB-15 | Header shows user info | — | Manual | Logged in | User name/email displayed |
| TC-WEB-16 | Logout clears session | FR-AUTH-006 | Manual | Logged in, click logout | Token removed, redirected to login |
| TC-WEB-17 | Admin page for admin user | FR-ADMIN-001 | Manual | ADMIN logged in | Admin dashboard with full access |
| TC-WEB-18 | Skeleton loader shown during fetch | — | Manual | Slow connection | Loading skeletons displayed |
| TC-WEB-19 | Document vault page renders | FR-DOC-001 | Manual | Navigate to shipment documents | Document list/upload area |
| TC-WEB-20 | Axios JWT interceptor works | FR-AUTH-006 | Auto | User logged in | All requests include Authorization header |

### TC-MOBILE — Mobile Test Cases

| TC-ID | Test Case | FR Covered | Type | Precondition | Expected Result |
|-------|-----------|------------|------|-------------|-----------------|
| TC-MOB-01 | Login screen renders correctly | FR-AUTH-003 | Manual | App installed, open app | Login form with email/password |
| TC-MOB-02 | Valid login navigates to Home | FR-AUTH-003 | Manual | Valid credentials | Home screen with shipments |
| TC-MOB-03 | Invalid login shows error | FR-AUTH-004 | Manual | Wrong credentials | Error dialog/snackbar |
| TC-MOB-04 | Register screen navigates from login | FR-AUTH-001 | Manual | Tap "Register" link | Register form displays |
| TC-MOB-05 | Register creates account and navigates to Home | FR-AUTH-001 | Manual | Fill register form, submit | Home screen with welcome state |
| TC-MOB-06 | Home screen shows shipment list | FR-SHIP-002 | Manual | Logged in with shipments | List of shipments with status/lane |
| TC-MOB-07 | Home shows empty state | FR-SHIP-002 | Manual | Logged in, no shipments | Empty state message |
| TC-MOB-08 | Demurrage badge colors correct | FR-SHIP-013 | Manual | Shipments with different lanes | GREEN=#4CAF50, YELLOW=#FF9800, RED=#F44336 |
| TC-MOB-09 | Token survives app restart | FR-AUTH-009 | Manual | Logged in, close and reopen app | Still logged in |
| TC-MOB-10 | Logout clears token | FR-AUTH-009 | Manual | Logged in, tap logout | Token removed, back to login |

---

## 5. Test Scripts / Test Steps

### 5.1 Backend API Test Script (Manual — curl / Postman)

#### Script AUTH-01: Full Auth Flow
```
Step 1: POST /api/v1/auth/register
    Body: {"email":"test.manual@portkey.dev","password":"P@ssw0rd123!","firstName":"Manual","lastName":"Test"}
    Verify: Status 201, response.success=true, response.data.accessToken is not empty

Step 2: POST /api/v1/auth/login
    Body: {"email":"test.manual@portkey.dev","password":"P@ssw0rd123!"}
    Verify: Status 200, response.success=true, response.data.user.email matches

Step 3: GET /api/v1/auth/me
    Header: Authorization: Bearer {accessToken from Step 1}
    Verify: Status 200, response.data.email matches, response.data.role="BROKER", response.data.plan="FREE"

Step 4: POST /api/v1/auth/register (duplicate)
    Body: same as Step 1
    Verify: Status 409, response.success=false, response.error.code="DB-002"
```

#### Script SHIP-01: Full Shipment Lifecycle
```
Step 1: POST /api/v1/shipments
    Header: Authorization: Bearer {token}
    Body: {
        "vesselName": "M/V Test Vessel",
        "voyageNumber": "V-2026-001",
        "arrivalDate": "2026-04-10",
        "portOfDischarge": "Cebu International Port",
        "clientName": "Test Importer Inc.",
        "containerNumbers": "TCNU1234567,TCNU7654321",
        "descriptionOfGoods": "Electronics and spare parts",
        "freeDays": 7,
        "items": [
            {"description":"Laptop","hsCode":"8471.30","quantity":10,"declaredValue":15000.00,"currency":"USD"},
            {"description":"Monitor","hsCode":"8528.52","quantity":20,"declaredValue":5000.00,"currency":"USD"}
        ]
    }
    Verify: Status 201, response.data.id > 0, response.data.status="ARRIVED", response.data.lane="GREEN"

Step 2: GET /api/v1/shipments/{id}
    Verify: Status 200, response.data.id matches, items array has 2 items

Step 3: GET /api/v1/shipments
    Verify: Status 200, array contains the created shipment

Step 4: PATCH /api/v1/shipments/{id}/status
    Verify: Status 200, response.data.status="LODGED"

Step 5: PATCH /api/v1/shipments/{id}/status (×3 more times)
    Verify: Status goes LODGED→ASSESSED→PAID→RELEASED

Step 6: PATCH /api/v1/shipments/{id}/status (on RELEASED)
    Verify: Error response (already released)

Step 7: DELETE /api/v1/shipments/{id}
    Verify: Status 200

Step 8: GET /api/v1/shipments/{id}
    Verify: Status 404 (soft deleted)
```

#### Script ADMIN-01: Admin Access Flow
```
Step 1: Login as ADMIN
    POST /api/v1/auth/login
    Body: {"email":"admin@portkey.dev","password":"Admin@123"}

Step 2: GET /api/v1/admin/shipments
    Header: Authorization: Bearer {adminToken}
    Verify: Status 200, array contains all shipments (not filtered by user)

Step 3: GET /api/v1/admin/users
    Verify: Status 200, array contains multiple users

Step 4: Login as BROKER
    Body: {"email":"broker@portkey.dev","password":"Broker@123"}

Step 5: GET /api/v1/admin/shipments (as BROKER)
    Header: Authorization: Bearer {brokerToken}
    Verify: Status 403, response.error.code="AUTH-003"
```

### 5.2 Web Frontend Test Script (Manual)

```
1. Open browser → navigate to http://localhost:3000
2. Verify: Redirected to /login page
3. Click "Register here" link → verify /register page loads
4. Enter registration data → submit → verify redirect to /dashboard
5. Verify dashboard sidebar shows: Dashboard, Shipments, Documents, Settings
6. Click "New Shipment" → verify form renders with all fields
7. Fill form → submit → verify redirect to shipment detail
8. Verify status badge shows "ARRIVED" with green color
9. Click "Advance Status" → verify status changes to "LODGED"
10. Click "Delete" → confirm dialog → verify shipment removed from list
11. Click Logout → verify redirected to /login
12. Login with admin credentials → verify admin menu visible
13. Navigate to /dashboard/admin → verify all shipments and users visible
14. Test responsive design at 375px, 768px, 1024px, 1440px widths
```

### 5.3 Mobile Test Script (Manual)

```
1. Install APK on Android device/emulator (API 26+)
2. Launch app → verify login screen displays
3. Enter email/password → tap Login → verify loading indicator
4. Verify navigated to Home screen with shipment list (or empty state)
5. Verify shipment items show vessel name, status, lane badge colors
6. Tap "Register" link on login → verify register screen
7. Fill registration → submit → verify navigated to Home
8. Kill app → reopen → verify still logged in (token persisted)
9. Tap Logout → verify returned to login screen
10. Verify all Material Design 3 components render correctly
```

---

## 6. Automated Test Cases

### 6.1 Backend — JUnit 5 + MockMvc Tests

```java
// AuthControllerTest.java — automated tests for auth module
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void register_ValidRequest_Returns201WithTokens() {
        RegisterRequest req = new RegisterRequest("auto@test.com", "Pass@123", "Auto", "Test");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
            .andExpect(jsonPath("$.data.user.email").value("auto@test.com"));
    }

    @Test
    void register_DuplicateEmail_Returns409() {
        // After first registration
        RegisterRequest req = new RegisterRequest("auto@test.com", "Pass@123", "Auto", "Test");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.error.code").value("DB-002"));
    }

    @Test
    void login_ValidCredentials_Returns200WithTokens() {
        LoginRequest req = new LoginRequest("auto@test.com", "Pass@123");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
            .andExpect(jsonPath("$.data.user.role").value("BROKER"));
    }

    @Test
    void login_InvalidCredentials_Returns401() {
        LoginRequest req = new LoginRequest("auto@test.com", "WrongPass");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error.code").value("AUTH-001"));
    }

    @Test
    void me_ValidToken_ReturnsUserProfile() {
        // Obtain token from login, then:
        mockMvc.perform(get("/api/v1/auth/me")
                .header("Authorization", "Bearer " + validToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.email").value("auto@test.com"));
    }

    @Test
    void me_NoToken_Returns401() {
        mockMvc.perform(get("/api/v1/auth/me"))
            .andExpect(status().isUnauthorized());
    }
}
```

```java
// ShipmentControllerTest.java
@SpringBootTest
@AutoConfigureMockMvc
class ShipmentControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    private String brokerToken;

    @BeforeEach
    void setup() {
        // Register + login to get broker token
    }

    @Test
    void createShipment_ValidRequest_Returns201() {
        CreateShipmentRequest req = CreateShipmentRequest.builder()
            .vesselName("M/V Auto Test")
            .clientName("Auto Client")
            .portOfDischarge("Port Auto")
            .build();

        mockMvc.perform(post("/api/v1/shipments")
                .header("Authorization", "Bearer " + brokerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.status").value("ARRIVED"))
            .andExpect(jsonPath("$.data.lane").value("GREEN"))
            .andExpect(jsonPath("$.data.freeDays").value(5));
    }

    @Test
    void listShipments_ReturnsBrokersShipments() {
        mockMvc.perform(get("/api/v1/shipments")
                .header("Authorization", "Bearer " + brokerToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void advanceStatus_ValidShipment_AdvancesToNextStage() {
        // Create shipment, then:
        mockMvc.perform(patch("/api/v1/shipments/1/status")
                .header("Authorization", "Bearer " + brokerToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("LODGED"));
    }

    @Test
    void getById_WrongOwner_Returns403() {
        // Using different broker's token
        mockMvc.perform(get("/api/v1/shipments/1")
                .header("Authorization", "Bearer " + otherBrokerToken))
            .andExpect(status().isForbidden());
    }

    @Test
    void softDelete_RemovesFromList() {
        mockMvc.perform(delete("/api/v1/shipments/1")
                .header("Authorization", "Bearer " + brokerToken))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/shipments/1")
                .header("Authorization", "Bearer " + brokerToken))
            .andExpect(status().isNotFound());
    }
}
```

```java
// AdminControllerTest.java
class AdminControllerTest {

    @Test
    void adminGetShipments_AsAdmin_ReturnsAllShipments() {
        mockMvc.perform(get("/api/v1/admin/shipments")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void adminGetShipments_AsBroker_Returns403() {
        mockMvc.perform(get("/api/v1/admin/shipments")
                .header("Authorization", "Bearer " + brokerToken))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.error.code").value("AUTH-003"));
    }

    @Test
    void adminGetUsers_ReturnsAllUsers() {
        mockMvc.perform(get("/api/v1/admin/users")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(org.hamcrest.Matchers.greaterThan(0)));
    }
}
```

### 6.2 Web Frontend — Jest + React Testing Library

```typescript
// auth-service.test.ts
describe('AuthService', () => {
  test('login returns AuthResponse on success', async () => {
    const response = await authService.login('test@test.com', 'Pass@123');
    expect(response.success).toBe(true);
    expect(response.data.accessToken).toBeDefined();
    expect(response.data.user.email).toBe('test@test.com');
  });

  test('login throws on invalid credentials', async () => {
    await expect(
      authService.login('test@test.com', 'wrong')
    ).rejects.toThrow();
  });

  test('register returns AuthResponse on success', async () => {
    const response = await authService.register('new@test.com', 'Pass@123', 'New', 'User');
    expect(response.success).toBe(true);
    expect(response.data.user.firstName).toBe('New');
  });
});

// api-client.test.ts
describe('ApiClient', () => {
  test('interceptor attaches Bearer token', async () => {
    tokenStore.setToken('test-token-123');
    // Make request and verify Authorization header
  });

  test('interceptor redirects on 401', async () => {
    // Verify token cleared and redirect to login
  });
});
```

### 6.3 Mobile — JUnit + MockWebServer Tests

```kotlin
// AuthRepositoryTest.kt
class AuthRepositoryTest {
    private lateinit var mockWebServer: MockWebServer
    private lateinit var authRepo: AuthRepository

    @Before
    fun setup() {
        mockWebServer = MockWebServer()
        mockWebServer.start()
        authRepo = AuthRepository(mockWebServer.url("/").toString())
    }

    @After
    fun teardown() {
        mockWebServer.shutdown()
    }

    @Test
    fun `login success returns AuthResponse with tokens`() = runTest {
        val mockResponse = """
            {"success":true,"data":{"user":{"email":"test@test.com"},"accessToken":"jwt123","refreshToken":"ref456"}}
        """.trimIndent()
        mockWebServer.enqueue(MockResponse().setBody(mockResponse).setResponseCode(200))

        val result = authRepo.login("test@test.com", "Pass@123")
        assertTrue(result.isSuccess)
        assertEquals("test@test.com", result.getOrNull()?.user?.email)
    }

    @Test
    fun `login failure returns error`() = runTest {
        mockWebServer.enqueue(MockResponse().setResponseCode(401))

        val result = authRepo.login("bad@test.com", "wrong")
        assertTrue(result.isFailure)
    }
}
```

---

## 7. Test Environment

| Component | Environment | Details |
|-----------|------------|---------|
| Backend | Localhost:8080 | Spring Boot 3.5, Java 17, H2 in-memory (test) or NeonDB (dev) |
| Web | Localhost:3000 | Next.js 16 dev server |
| Mobile | Android Emulator API 34 | Pixel 6 emulator, target SDK 34 |
| Database (Test) | H2 In-Memory | Configured in application-test.properties |
| Database (Dev) | NeonDB PostgreSQL | Separate test database |
| CI/CD | GitHub Actions | Maven build + npm build on push to main |

---

## 8. Test Data

### Users
| Email | Password | Role | Plan | Purpose |
|-------|----------|------|------|---------|
| admin@portkey.dev | Admin@123 | ADMIN | PRO | Admin testing |
| broker1@portkey.dev | Broker@123 | BROKER | FREE | Primary broker testing |
| broker2@portkey.dev | Broker@456 | BROKER | PRO | Cross-broker access testing |

### Shipments (for broker1)
| Vessel | Status | Lane | Free Days | Arrival | Doomsday |
|--------|--------|------|-----------|---------|----------|
| M/V Green Star | ARRIVED | GREEN | 10 | 2026-04-01 | 2026-04-11 |
| M/V Yellow Wave | LODGED | YELLOW | 5 | 2026-04-05 | 2026-04-10 |
| M/V Red Alert | ASSESSED | RED | 3 | 2026-04-06 | 2026-04-09 |

### Test API Responses
See `test-api.js` in project root for scripted test data.

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Refactoring breaks import paths | Medium | High | Automated import verification via IDE, compilation check |
| Package restructuring breaks Spring component scan | Low | High | Explicit @ComponentScan or @SpringBootApplication at root |
| Web route restructuring breaks Next.js routing | Medium | Medium | Preserve `app/` directory structure, update only internal organization |
| Mobile package rename breaks Android manifest | Low | High | Keep base package same, restructure sub-packages only |
| Database connection fails during testing | Low | Medium | Use H2 in-memory for tests, verify NeonDB connection separately |
| JWT token parsing fails after refactoring | Low | High | JwtService is in separate package, no dependencies on feature structure |
| Environment variables not loaded | Medium | Medium | Document all required env vars in .env.example files |

---

## Test Execution Schedule

| Phase | Tests | Duration | Dependencies |
|-------|-------|----------|-------------|
| Phase 1: Smoke | TC-AUTH-01 through TC-AUTH-07 | 15 min | Backend running |
| Phase 2: Core | TC-SHIP-01 through TC-SHIP-14 | 30 min | Phase 1 complete |
| Phase 3: Advanced | TC-SHIP-15 through TC-SHIP-20, TC-ADMIN-*, TC-DOC-* | 25 min | Phase 2 complete |
| Phase 4: Web UI | TC-WEB-01 through TC-WEB-20 | 40 min | Phase 3 complete |
| Phase 5: Mobile | TC-MOB-01 through TC-MOB-10 | 30 min | Phase 3 complete |
| Phase 6: Automated | All automated test suites | 10 min (automated) | Phase 1 complete |

**Total estimated manual testing time:** ~2.5 hours
**Total automated test runtime:** ~10 minutes

---

*End of Test Plan*