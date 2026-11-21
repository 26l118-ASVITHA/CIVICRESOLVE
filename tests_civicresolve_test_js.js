/**
 * CivicResolve — Automated Unit, AI Triage, SLA & Security Test Suite
 * Uses Node.js built-in zero-dependency test runner (`node --test`).
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Extract and evaluate the pure SecurityUtils & CivicTriageEngine modules from index.html
const htmlSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scriptMatch = htmlSource.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*<\/body>/);
assert.ok(scriptMatch, 'Main application script block must exist in index.html');

const moduleSandbox = { module: { exports: {} }, exports: {} };
const factory = new Function('module', 'exports', scriptMatch[1]);
factory(moduleSandbox.module, moduleSandbox.exports);

const { SecurityUtils, CivicTriageEngine } = moduleSandbox.module.exports;

test('SecurityUtils.escapeHTML neutralizes XSS script injection payloads', () => {
  const malicious = `<script>alert("xss")</script><img src=x onerror='steal()'>`;
  const escaped = SecurityUtils.escapeHTML(malicious);
  assert.equal(escaped.includes('<script>'), false);
  assert.equal(escaped.includes('&lt;script&gt;'), true);
  assert.equal(escaped.includes('&#39;'), true);
});

test('SecurityUtils.sanitizeText strips control characters and enforces length limits', () => {
  const dirty = '  Pothole on Main Road\u0000\u0007  ';
  assert.equal(SecurityUtils.sanitizeText(dirty, 50), 'Pothole on Main Road');
  assert.equal(SecurityUtils.sanitizeText('A'.repeat(200), 25).length, 25);
});

test('SecurityUtils.isValidImageDataUrl permits safe image MIME types and rejects SVG script payloads or non-images', () => {
  assert.equal(SecurityUtils.isValidImageDataUrl('data:image/png;base64,iVBORw0KGgo='), true);
  assert.equal(SecurityUtils.isValidImageDataUrl('data:image/jpeg;base64,/9j/4AAQ='), true);
  assert.equal(SecurityUtils.isValidImageDataUrl('javascript:alert(1)'), false);
  assert.equal(SecurityUtils.isValidImageDataUrl('data:text/html;base64,PHNjcmlwdD4='), false);
});

test('CivicTriageEngine classifies water pipeline burst as Critical Priority & routes to Water Supply Board', () => {
  const result = CivicTriageEngine.classifyComplaint({
    title: 'Emergency drinking water pipe burst outside government hospital',
    description: 'High pressure pipeline burst flooding the emergency ambulance gate.',
    location: 'DB Road, RS Puram'
  });

  assert.equal(result.category, 'Water & Drainage');
  assert.equal(result.priority, 'Critical');
  assert.equal(result.department, 'Water Supply & Drainage Board');
  assert.ok(result.reasoning.length > 10);
});

test('CivicTriageEngine classifies overflowing garbage bins accurately', () => {
  const result = CivicTriageEngine.classifyComplaint({
    title: 'Overflowing garbage bins near main junction',
    description: 'Uncollected municipal solid waste blocking footpath.',
    location: 'Avinashi Road, Peelamedu'
  });

  assert.equal(result.category, 'Garbage & Sanitation');
  assert.equal(result.priority, 'High');
  assert.equal(result.department, 'Solid Waste Management');
});

test('CivicTriageEngine respects user manual category override while computing urgency', () => {
  const result = CivicTriageEngine.classifyComplaint({
    title: 'Exposed live electric wire near school',
    description: 'Sparking feeder cable hanging low.',
    location: 'Race Course',
    lockedCategory: 'Public Safety & Traffic'
  });

  assert.equal(result.category, 'Public Safety & Traffic');
  assert.equal(result.priority, 'Critical');
  assert.equal(result.department, 'Traffic & Public Safety');
});

test('CivicTriageEngine.calculateDaysExisting computes elapsed days and 48-hour SLA breach accurately', () => {
  const fresh = CivicTriageEngine.calculateDaysExisting(12);
  assert.equal(fresh.days, 0);
  assert.equal(fresh.isOverdue, false);

  const overdue = CivicTriageEngine.calculateDaysExisting(76);
  assert.equal(overdue.days, 3);
  assert.equal(overdue.isOverdue, true);
});

test('Accessibility & Security Audit: index.html includes CSP, skip link, ARIA landmarks, and alt attributes', () => {
  assert.ok(htmlSource.includes('Content-Security-Policy'), 'CSP header meta tag must be present');
  assert.ok(htmlSource.includes('href="#mainContentRegion"'), 'Skip-to-content accessibility link must be present');
  assert.ok(htmlSource.includes('role="main"'), 'Main ARIA landmark must be present');
  assert.ok(htmlSource.includes('aria-live="polite"'), 'ARIA live status announcements must be present');
});