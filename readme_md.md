# CivicResolve — AI-Powered Citizen-to-Government Civic Grievance Platform

🌐 **Live Demo:** <https://26l118-asvitha.github.io/CIVICRESOLVE/>

> **GitHub Repository Description:**
> *AI-powered civic grievance platform using Google Gemini triage, live Google Maps pointers, voice reporting, SLA tracking, and photo resolution proof.*

## Problem Statement Alignment

Municipal governance faces three persistent bottlenecks when handling urban infrastructure complaints:
1. **Unstructured Citizen Reports & Manual Routing Delays:** Citizens often submit vague descriptions without knowing which municipal wing is responsible, causing complaints to bounce between departments.
2. **Lack of Urgency Triage:** Critical public safety hazards (such as burst water mains near hospitals or live electrical wires) sit in the same first-in-first-out queue as routine cosmetic maintenance.
3. **Zero Accountability Loop:** Citizens rarely receive verifiable proof that field crews resolved the issue, leading to duplicate tickets and low civic trust.

**How CivicResolve Solves This End-to-End:**
* **Instant AI Triage (`Google Gemini 3 Flash`):** Automatically classifies complaints into 5 civic categories, assigns a 4-tier public safety priority (`Critical`, `High`, `Medium`, `Low`), and routes tickets directly to the responsible municipal department.
* **Multi-Modal & Accessible Reporting:** Supports text, geo-tagged photos, and an **AI Voice Complaint Assistant** across English (`EN`), Tamil (`தமிழ்`), and Hindi (`हिंदी`), built to WCAG 2.1 AA accessibility standards.
* **Closed-Loop Municipal Resolution:** Tracks complaints across **`Reported` → `In Progress` → `Resolved`**, monitors 48-hour SLA aging (`Days Existing`), and requires municipal officers to upload verified **Before & After completion photos** stamped with their Employee ID.

## Key Features

1. **Live Google Maps & Street Pointers:** Interactive Map/Satellite view with color-coded pins and one-click street zoom (`z=17`).
2. **Google Gemini AI Classification & Priority Detection:** Structured JSON triage with deterministic offline fallback for zero-downtime reliability.
3. **Issue Tracking Dashboard & Printable Receipts:** Real-time workflow progress bars, Days Existing badges, ticket withdrawal for open reports, and printable PDF acknowledgement receipts.
4. **Municipal Admin Resolution Workbench:** Individual Officer login with 2-step Gov OTP (`739154`), SLA watchdog alerts, Active vs. Resolved Evidence columns, and Daily Ward Audit Reports.

## Security, Accessibility & Engineering Standards

* **XSS Prevention & Input Sanitization:** All user-generated inputs and dynamic DOM templates pass through `SecurityUtils.escapeHTML()`, `SecurityUtils.sanitizeText()`, and strict image MIME validation (`SecurityUtils.isValidImageDataUrl()`).
* **Content Security Policy (CSP):** Enforces strict `default-src`, `script-src`, `connect-src`, and `frame-src` policies via meta headers.
* **WCAG 2.1 AA Accessibility:** Includes a keyboard skip-to-content link, semantic landmarks (`banner`, `main`, `dialog`, `region`), `aria-live` status regions, high-contrast badges, and `prefers-reduced-motion` support.
* **Encapsulated Modular Architecture:** Pure business logic (`CivicTriageEngine` & `SecurityUtils`) is decoupled from UI state (`CivicApp`) for deterministic unit testing.

## Running Automated Tests

CivicResolve includes a zero-dependency automated test suite (`tests/civicresolve.test.js`) covering XSS sanitization, Gemini fallback classification, SLA aging calculations, and WCAG/CSP compliance:

```bash
npm test
```

## Demo Credentials (Built-In)

| Portal Role | Login Details | Demo OTP Code |
| :--- | :--- | :--- |
| **Citizen Portal** | Click **Citizen Login** (pre-filled citizen details) | `482910` |
| **Admin Dashboard** | Click **Admin Login → Demo Admin** (or enter Officer Name, Rank & Gov ID) | `739154` |

## Project Structure

```text
CIVICRESOLVE/
├── index.html                  # Modular single-file CivicResolve application (CSP, WCAG 2.1 AA, Gemini AI triage)
├── package.json                # Node test & security lint scripts
├── tests/
│   └── civicresolve.test.js    # Automated unit, security & accessibility test suite
└── README.md                   # Problem statement alignment, architecture & setup guide
```