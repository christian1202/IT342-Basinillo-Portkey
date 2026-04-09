# PORTKEY — ACTIVE CONTEXT
> Single source of truth. Update the "Current Status" and "What's DONE" sections after every dev session.
> Last updated: 2026-04-08 | Session: Mobile kickoff (Login + Register + Home)

---

## Project Identity
- **App:** PortKey — Intelligent Customs Clearance Platform
- **Course:** IT342-G3 System Integration and Architecture, CIT-U
- **Dev:** Solo (Christian Jay Basinillo)
- **Repo:** christian1202/IT342-Basinillo-Portkey
- **Branch:** main

---

## Full Stack (DO NOT deviate)

| Layer | Tech | Notes |
|---|---|---|
| Backend | Spring Boot 3.5 / Java 17 / Maven | Package: `edu.cit.basinillo.portkey` |
| Database | NeonDB (PostgreSQL) via Spring Data JPA | |
| Web | Next.js 16 / React 19 / TypeScript / Tailwind CSS | |
| Web Forms | React Hook Form 7 + Zod 4 | |
| Web HTTP | Axios 1.13 + JWT interceptor in `lib/api-client.ts` | |
| Mobile | Kotlin / Android API 34 / **XML layouts ONLY** | No Jetpack Compose — ever |
| Mobile HTTP | Retrofit2 + OkHttp3 | |
| Mobile Auth | EncryptedSharedPreferences for JWT storage | |
| Mobile Push | Firebase Cloud Messaging (FCM) | |
| Auth | Custom JWT (stateless) + Google OAuth2 | jjwt 0.12.6 |
| Files | Cloudflare R2 via AWS SDK | |
| Security | Spring Security + BCrypt cost factor 12 | |

---

## API Reference (Mobile needs this)

**Base URL:** `https://[backend-host]/api/v1`

**Standard response wrapper (ALL endpoints):**
```json
{
  "success": true,
  "data": {},
  "error": { "code": "string", "message": "string", "details": null },
  "timestamp": "2026-04-08T10:00:00Z"
}
```

**Auth Endpoints (no Bearer token required):**

POST `/auth/register`
```json
Request:  { "email": "", "password": "", "firstname": "", "lastname": "" }
Response data: { "user": { "email", "firstname", "lastname" }, "accessToken": "", "refreshToken": "" }
```

POST `/auth/login`
```json
Request:  { "email": "", "password": "" }
Response data: { "user": { "email", "firstname", "lastname", "role": "BROKER|ADMIN" }, "accessToken": "", "refreshToken": "" }
```

GET `/auth/me` — Bearer token required
```json
Response data: { "email", "firstname", "lastname", "role": "BROKER|ADMIN", "plan": "FREE|PRO" }
```

**Shipment Endpoints (Bearer token required):**

GET `/shipments` — returns broker's own shipments (sorted by demurrage urgency)
Query params: `?status=ACTIVE&lane=GREEN&search=keyword`

GET `/shipments/{id}` — full shipment detail

POST `/shipments` — create shipment

PATCH `/shipments/{id}/status` — advance lifecycle stage

DELETE `/shipments/{id}` — soft delete

**Error Codes:**
- `AUTH-001` Invalid credentials
- `AUTH-002` Token expired
- `AUTH-003` Insufficient permissions
- `VALID-001` Validation failed
- `DB-001` Resource not found
- `DB-002` Duplicate entry
- `SYSTEM-001` Internal server error

---

## Domain Knowledge (for UI labels and logic)

**Shipment lifecycle stages (in order):**
`ARRIVED → LODGED → ASSESSED → PAID → RELEASED`

**Demurrage urgency lanes:**
- `GREEN` — Safe (more than 3 days left) — green badge
- `YELLOW` — Warning (2–3 days left) — orange badge, pulsing
- `RED` — Critical (0–1 days left) — red badge, flashing

**User roles:**
- `BROKER` — sees only their own shipments
- `ADMIN` — sees all shipments across all brokers

**Plans:** `FREE` (10 shipment limit) / `PRO` (unlimited, via PayMongo upgrade)

---

## Backend — What's DONE (do not regenerate)

**Entities (6):** User, Shipment, ShipmentItem, Document, Payment, Device

**Enums (5):** Role (BROKER/ADMIN), Plan (FREE/PRO), ShipmentStatus, ShipmentLane, DocumentType (BL/CI/PL/PERMIT/OTHER)

**Repositories (6):** One per entity, all extending JpaRepository

**Security:** SecurityConfig, JwtService, JwtAuthenticationFilter, CustomUserDetailsService

**Config:** JwtProperties, CorsProperties, R2Properties
- CORS allows: `portkey.vercel.app` and `localhost:3000` only

**DTOs (12):** ApiResponse, ApiError, AuthResponse, UserDto, LoginRequest, RegisterRequest, CreateShipmentRequest, UpdateShipmentRequest, ShipmentResponse, ShipmentItemRequest, ShipmentItemResponse, ShipmentAnalysisResponse

**Exceptions:** GlobalExceptionHandler, ResourceNotFoundException, DuplicateResourceException, UnauthorizedException

**Services:** AuthService ✅, ShipmentService ✅, ShipmentAnalysisService ✅, DocumentService (structure only), AdminService ✅

**Controllers:** AuthController ✅ (register/login/me), ShipmentController ✅, DocumentController (structure only), AdminController ✅

**Confirmed working via git commit:** User Registration + Login

---

## Web Frontend — What's DONE (do not regenerate)

**Pages (12):** login, register, dashboard, shipments list, shipments/new, shipments/[id], shipments/[id]/edit, shipments/[id]/documents, admin

**Components:** DashboardLayout, Header, Sidebar, Button, Input, Modal, ErrorMessage, SkeletonLoader

**Hooks:** useAuth, useShipments, useDemurrage

**Services:** auth-service, shipment-service, document-service, admin-service

**Lib:** api-client.ts (Axios + JWT interceptor), token-store.ts, types/index.ts, proxy.ts

---

## Mobile — Current Session Target

**Status: 0% — starting now**

**Today's goal:** Android project foundation + Login screen + Register screen + Home/Dashboard screen

**Hard constraints for mobile:**
- XML layouts ONLY — no Jetpack Compose, no DataBinding unless specified
- Target SDK: API 34 (Android 14), Min SDK: API 26
- JWT stored in EncryptedSharedPreferences ONLY — never plain SharedPreferences
- OkHttp3 interceptor attaches Bearer token to every authenticated request
- Retrofit2 for all API calls — no raw HTTP
- Material Design 3 components via XML
- Urgency colors set programmatically in code, not hardcoded in XML
  - Safe = `#4CAF50`, Warning = `#FF9800`, Critical = `#F44336`

**Planned screens (full mobile scope):**
1. Login (today)
2. Register (today)
3. Shipment List / Home Dashboard (today — basic version)
4. Shipment Detail
5. Document Vault
6. FCM push notification handling

**Architecture pattern:** MVVM
- ViewModel per screen
- Repository layer for API calls
- Retrofit service interfaces

---

## Backend — Remaining Work

- [ ] Demurrage cron job (`@Scheduled`, runs 8 AM PHT / UTC+8)
- [ ] Cloudflare R2 actual file upload in DocumentService
- [ ] ExchangeRate-API integration (cache result 24h in DB)
- [ ] WebSocket / STOMP real-time config
- [ ] Google OAuth2 backend callback handler
- [ ] PayMongo `/create-link` + webhook

## Web Frontend — Remaining Work

- [ ] WebSocket live updates (SockJS + STOMP.js)
- [ ] PayMongo Pro plan upgrade flow
- [ ] React Dropzone for document upload
- [ ] Google OAuth2 frontend flow

---

## DB Tables (quick reference)

```
users          — id, email, password_hash, full_name, role, plan, google_id, created_at
shipments      — id, user_id, vessel_name, voyage_number, arrival_date, port_of_discharge,
                 client_name, container_numbers, free_days, doomsday_date,
                 status (ARRIVED/LODGED/ASSESSED/PAID/RELEASED),
                 lane (GREEN/YELLOW/RED), entry_number, or_number, deleted_at, created_at
shipment_items — id, shipment_id, description, hs_code, quantity,
                 declared_value, currency, php_converted_value, exchange_rate, created_at
documents      — id, shipment_id, file_name, file_url, type, size_bytes, uploaded_at
payments       — id, user_id, amount, status, reference_number, created_at
devices        — id, user_id, fcm_token, device_model, registered_at
```

---

## Deployment Targets

| Layer | Target |
|---|---|
| Backend | Railway or Heroku |
| Web | Vercel or Netlify |
| Database | NeonDB (serverless PostgreSQL) |
| Mobile | APK direct install (not Play Store) |
| Files | Cloudflare R2 |

---

## Overall Progress

| Layer | Progress |
|---|---|
| Backend | ~70% |
| Web | ~75% |
| Mobile | 0% → in progress |
| Overall | ~48% |
