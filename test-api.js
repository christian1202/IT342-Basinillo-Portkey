#!/usr/bin/env node
/* ================================================================== */
/*  PORTKEY — Automated API Regression Test Suite                      */
/*  Tests: Register, Login, Get Me, Shipments, Admin, Documents        */
/*  Usage: node test-api.js                                            */
/*  Requires: Backend running on http://localhost:8080                  */
/*  Outputs: Full test results with PASS/FAIL for screenshot evidence  */
/* ================================================================== */

const http = require("http");

// ── Configuration ─────────────────────────────────────────────
const HOST = "localhost";
const PORT = 8080;
const BASE = "/api/v1";

// Test user credentials (randomized per run to avoid duplicates)
const testId = Date.now().toString(36);
const TEST_USER = {
  email: `test-${testId}@portkey.dev`,
  password: "Test@Pass123!",
  firstName: "Test",
  lastName: "Runner",
};

// ── Track results ─────────────────────────────────────────────
const results = [];
let accessToken = null;

// ── HTTP Helper ────────────────────────────────────────────────
function apiRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (data) headers["Content-Length"] = Buffer.byteLength(data);

    const options = { hostname: HOST, port: PORT, path: BASE + path, method, headers };
    const req = http.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => (responseData += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(responseData);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, body: responseData });
        }
      });
    });

    req.on("error", (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
}

// ── Log helpers ────────────────────────────────────────────────
function pass(name, detail) {
  results.push({ name, status: "PASS", detail });
  console.log(`\n✅ PASS — ${name}`);
  console.log(`   ${detail}`);
}

function fail(name, detail) {
  results.push({ name, status: "FAIL", detail });
  console.log(`\n❌ FAIL — ${name}`);
  console.log(`   ${detail}`);
}

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'═'.repeat(60)}`);
}

// ── Test 1: Health Check ──────────────────────────────────────
async function testHealthCheck() {
  section("TEST 1: Health Check");
  try {
    const { status } = await apiRequest("GET", "/auth/login");
    // Even 405 (method not allowed) means server is up
    if (status === 405 || status === 200 || status === 401) {
      pass("Server is reachable", `Status: ${status} — server is running`);
    } else {
      fail("Server unreachable", `Unexpected status: ${status}`);
    }
  } catch {
    fail("Server unreachable", "Connection refused — is the backend running on port 8080?");
  }
}

// ── Test 2: Registration ──────────────────────────────────────
async function testRegister() {
  section("TEST 2: User Registration");
  try {
    const { status, body } = await apiRequest("POST", "/auth/register", TEST_USER);
    if (status === 201 && body.success && body.data?.accessToken) {
      accessToken = body.data.accessToken;
      pass("Registration successful", `User: ${body.data.user.email} | Token: ${accessToken.substring(0, 20)}...`);
    } else if (status === 409) {
      pass("Duplicate detection works", "Email already registered (expected for re-runs)");
      // Fallback: try login
      return testLogin();
    } else {
      fail("Registration failed", `Status ${status}: ${JSON.stringify(body.error || body)}`);
    }
  } catch (err) {
    fail("Registration error", err.message);
  }
}

// ── Test 3: Login ─────────────────────────────────────────────
async function testLogin() {
  section("TEST 3: User Login");
  try {
    const { status, body } = await apiRequest("POST", "/auth/login", {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    if (status === 200 && body.success && body.data?.accessToken) {
      accessToken = body.data.accessToken;
      pass("Login successful", `User: ${body.data.user.email} | Role: ${body.data.user.role}`);
    } else {
      fail("Login failed", `Status ${status}: ${JSON.stringify(body.error || body)}`);
    }
  } catch (err) {
    fail("Login error", err.message);
  }
}

// ── Test 4: Invalid Login ─────────────────────────────────────
async function testInvalidLogin() {
  section("TEST 4: Invalid Login (Error Handling)");
  try {
    const { status, body } = await apiRequest("POST", "/auth/login", {
      email: TEST_USER.email,
      password: "WrongPassword123!",
    });
    if (status === 401 && body.error?.code === "AUTH-001") {
      pass("Invalid credentials rejected", `Error: ${body.error.message}`);
    } else {
      fail("Expected AUTH-001", `Got status ${status}: ${JSON.stringify(body)}`);
    }
  } catch (err) {
    fail("Invalid login test error", err.message);
  }
}

// ── Test 5: Get Current User ──────────────────────────────────
async function testGetMe() {
  section("TEST 5: Get Current User (/auth/me)");
  if (!accessToken) return fail("Skipped — no token", "Login or register must pass first");
  try {
    const { status, body } = await apiRequest("GET", "/auth/me", null, accessToken);
    if (status === 200 && body.success && body.data?.email) {
      pass("Profile fetched", `Email: ${body.data.email} | Role: ${body.data.role} | Plan: ${body.data.plan}`);
    } else {
      fail("Get me failed", `Status ${status}: ${JSON.stringify(body.error || body)}`);
    }
  } catch (err) {
    fail("Get me error", err.message);
  }
}

// ── Test 6: Unauthorized Access ───────────────────────────────
async function testUnauthorized() {
  section("TEST 6: Unauthorized Access (No Token)");
  try {
    const { status } = await apiRequest("GET", "/auth/me");
    if (status === 401 || status === 403) {
      pass("Protected endpoint denied", `Status ${status} — no token = no access`);
    } else {
      fail("Expected 401/403", `Got status ${status}`);
    }
  } catch (err) {
    fail("Unauthorized test error", err.message);
  }
}

// ── Test 7: Create Shipment ───────────────────────────────────
async function testCreateShipment() {
  section("TEST 7: Create Shipment");
  if (!accessToken) return fail("Skipped — no token", "Login or register must pass first");
  try {
    const shipment = {
      vesselName: "M/V Test Vessel",
      clientName: "Test Importer Inc.",
      portOfDischarge: "Cebu International Port",
      voyageNumber: "V-2026-TEST",
      arrivalDate: "2026-05-10",
      freeDays: 7,
      items: [
        { description: "Laptop", hsCode: "8471.30", quantity: 10, declaredValue: 15000, currency: "USD" },
      ],
    };
    const { status, body } = await apiRequest("POST", "/shipments", shipment, accessToken);
    if (status === 201 && body.success && body.data?.id) {
      pass("Shipment created", `ID: ${body.data.id} | Status: ${body.data.status} | Lane: ${body.data.lane}`);
    } else {
      fail("Create shipment failed", `Status ${status}: ${JSON.stringify(body.error || body)}`);
    }
  } catch (err) {
    fail("Create shipment error", err.message);
  }
}

// ── Test 8: List Shipments ────────────────────────────────────
async function testListShipments() {
  section("TEST 8: List Shipments");
  if (!accessToken) return fail("Skipped — no token", "Login or register must pass first");
  try {
    const { status, body } = await apiRequest("GET", "/shipments", null, accessToken);
    if (status === 200 && body.success && Array.isArray(body.data)) {
      pass("Shipments listed", `Count: ${body.data.length} shipment(s) returned`);
    } else {
      fail("List shipments failed", `Status ${status}: ${JSON.stringify(body.error || body)}`);
    }
  } catch (err) {
    fail("List shipments error", err.message);
  }
}

// ── Test 9: Shipment Analysis ─────────────────────────────────
async function testShipmentAnalysis() {
  section("TEST 9: Shipment Analysis");
  if (!accessToken) return fail("Skipped — no token", "Login or register must pass first");
  try {
    const { status, body } = await apiRequest("GET", "/shipments/analysis", null, accessToken);
    if (status === 200 && body.success && body.data) {
      pass("Analysis fetched", `Total: ${body.data.totalShipments} | Active: ${body.data.activeShipments} | Completed: ${body.data.completedShipments}`);
    } else {
      fail("Analysis failed", `Status ${status}: ${JSON.stringify(body.error || body)}`);
    }
  } catch (err) {
    fail("Analysis error", err.message);
  }
}

// ── Test 10: Admin Access Denied ──────────────────────────────
async function testAdminAccessDenied() {
  section("TEST 10: Admin Access Denied (Broker Token)");
  if (!accessToken) return fail("Skipped — no token", "Login or register must pass first");
  try {
    const { status, body } = await apiRequest("GET", "/admin/shipments", null, accessToken);
    if (status === 403) {
      pass("Admin endpoint blocked for broker", `Error: ${body.error?.code} — ${body.error?.message}`);
    } else {
      fail("Expected 403 forbidden", `Got status ${status}: ${JSON.stringify(body)}`);
    }
  } catch (err) {
    fail("Admin access test error", err.message);
  }
}

// ── Test 11: Validation Error ─────────────────────────────────
async function testValidationError() {
  section("TEST 11: Validation Error (Missing Fields)");
  if (!accessToken) return fail("Skipped — no token", "Login or register must pass first");
  try {
    const { status, body } = await apiRequest("POST", "/shipments", {}, accessToken);
    if (status === 400 && body.error?.code === "VALID-001") {
      pass("Validation error returned", `Fields: ${JSON.stringify(body.error.details)}`);
    } else {
      fail("Expected VALID-001", `Got status ${status}: ${JSON.stringify(body)}`);
    }
  } catch (err) {
    fail("Validation test error", err.message);
  }
}

// ── Run All Tests ─────────────────────────────────────────────
async function runAll() {
  console.clear();
  console.log(`${'═'.repeat(60)}`);
  console.log(`  PORTKEY — Automated API Regression Test Suite`);
  console.log(`  Target: http://${HOST}:${PORT}${BASE}`);
  console.log(`  Date: ${new Date().toISOString()}`);
  console.log(`${'═'.repeat(60)}`);

  await testHealthCheck();
  await testRegister();
  await testInvalidLogin();
  await testGetMe();
  await testUnauthorized();
  await testCreateShipment();
  await testListShipments();
  await testShipmentAnalysis();
  await testAdminAccessDenied();
  await testValidationError();

  // ── Summary ───────────────────────────────────────────────
  section("TEST SUMMARY");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const total = results.length;
  const rate = ((passed / total) * 100).toFixed(1);

  console.log(`\n  Total Tests: ${total}`);
  console.log(`  Passed:      ${passed} ✅`);
  console.log(`  Failed:      ${failed} ❌`);
  console.log(`  Pass Rate:   ${rate}%`);
  console.log(`\n${'═'.repeat(60)}`);

  if (failed > 0) {
    console.log(`\n  FAILED TESTS:`);
    results.filter((r) => r.status === "FAIL").forEach((r) => {
      console.log(`  ❌ ${r.name}: ${r.detail}`);
    });
    console.log(`\n${'═'.repeat(60)}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

runAll().catch((err) => {
  console.error(`\n💥 FATAL: ${err.message}`);
  process.exit(2);
});
