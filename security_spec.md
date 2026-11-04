# AVENIQ Studio — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants & Master Source of Truth

1. **Default-Deny Catch-All**: All paths under `/databases/{database}/documents` default to `allow read, write: if false;`.
2. **Verified Identity Invariant**: Every read and write operation requires an authenticated user with a verified email (`request.auth != null && request.auth.token.email_verified == true`).
3. **Ownership & PII Isolation Invariant**:
   - `Enquiry` documents (`/enquiries/{enquiryId}`) contain client PII (`email`, `phone`, `fullName`). Read (`get`, `list`) access is strictly isolated to the document creator (`resource.data.ownerId == request.auth.uid`) or a verified Studio Admin (`request.auth.token.email == 'abhighodke5123@gmail.com'`). Blanket `isSignedIn()` reads are strictly forbidden.
   - `OpdAppointment` documents (`/opdAppointments/{appointmentId}`) contain patient names and clinical scheduling choices. Read (`get`, `list`) access is strictly isolated to `resource.data.ownerId == request.auth.uid` or a verified Studio Admin.
4. **Path Variable Hardening**: Every single-document target (`get`, `create`, `update`, `delete`) validates its path ID via `isValidId(id)` (`id is string && id.size() >= 1 && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$')`). `isValidId` is omitted on `list` operations.
5. **Strict Schema Blueprint & Anti-Update-Gap**:
   - `isValidEnquiry(data)` and `isValidOpdAppointment(data)` validate both `create` and `update` operations.
   - Every key is bounded by `hasAll` and `hasOnly` on `create`, and `affectedKeys().hasOnly(...)` on `update`.
   - Every string field enforces both `is string` and explicit `.size()` min/max boundaries matching `firebase-blueprint.json`.
6. **Temporal Integrity & Immortal Fields**:
   - On `create`: `incoming().createdAt == request.time && incoming().updatedAt == request.time`.
   - On `update`: `incoming().createdAt == existing().createdAt && incoming().ownerId == existing().ownerId && incoming().updatedAt == request.time`.
7. **Terminal State Locking**:
   - Once an `Enquiry` reaches `status == 'completed'` or `status == 'archived'`, non-admin users cannot mutate the document.
   - Once an `OpdAppointment` reaches `status == 'completed'` or `status == 'cancelled'`, non-admin users cannot mutate the document.
8. **Cost-Optimized List Queries**:
   - `allow list` rules evaluate `resource.data.ownerId == request.auth.uid` (or verified admin email) directly without any `get()` or `exists()` calls.

---

## 2. The "Dirty Dozen" Adversarial Payloads

Every payload below is designed to attack Identity, Integrity, Volumetric Bounds, or State Machines and MUST return `PERMISSION_DENIED`:

1. **Payload 01 — Identity Spoofing on Enquiry Create**:
   ```json
   {
     "ownerId": "victim_uid_999",
     "fullName": "Dr. Rajesh Verma",
     "businessName": "Zenith Hospital",
     "email": "rajesh@zenith.org",
     "phone": "+919820012345",
     "country": "India",
     "interestedService": "Hospital Website",
     "budgetRange": "$10,000 - $25,000 (₹8L - ₹20L)",
     "timeline": "1-3 months",
     "projectDescription": "Complete multi-speciality hospital portal with doctor directory.",
     "status": "submitted",
     "createdAt": "SERVER_TIMESTAMP",
     "updatedAt": "SERVER_TIMESTAMP"
   }
   ```
   *Rejected because `ownerId != request.auth.uid`.*

2. **Payload 02 — Shadow / Ghost Field Injection on Enquiry Create**:
   ```json
   {
     "ownerId": "user_uid_1",
     "fullName": "Dr. Rajesh Verma",
     "businessName": "Zenith Hospital",
     "email": "rajesh@zenith.org",
     "phone": "+919820012345",
     "country": "India",
     "interestedService": "Hospital Website",
     "budgetRange": "$10,000 - $25,000 (₹8L - ₹20L)",
     "timeline": "1-3 months",
     "projectDescription": "Complete multi-speciality hospital portal with doctor directory.",
     "status": "submitted",
     "isVerifiedAdmin": true,
     "createdAt": "SERVER_TIMESTAMP",
     "updatedAt": "SERVER_TIMESTAMP"
   }
   ```
   *Rejected by `data.keys().hasOnly(...)`.*

3. **Payload 03 — Unverified Email Spoof Attack on Admin Read/Update**:
   - Auth Context: `{ uid: "attacker_1", token: { email: "abhighodke5123@gmail.com", email_verified: false } }`
   - Action: `get` or `list` `/enquiries`
   *Rejected because `request.auth.token.email_verified == true` is mandatory.*

4. **Payload 04 — Cross-Tenant PII Blanket Read**:
   - Auth Context: `{ uid: "user_uid_2", token: { email: "other@client.com", email_verified: true } }`
   - Action: `get` `/enquiries/enquiry_owned_by_user_1`
   *Rejected because `resource.data.ownerId != request.auth.uid` and user is not admin.*

5. **Payload 05 — Unconstrained List Query Scraping**:
   - Auth Context: `{ uid: "user_uid_2", token: { email: "other@client.com", email_verified: true } }`
   - Action: `list` `/enquiries` without `where('ownerId', '==', 'user_uid_2')`
   *Rejected because `allow list` enforces `resource.data.ownerId == request.auth.uid`.*

6. **Payload 06 — Path ID Poisoning (Invalid Regex / Oversized ID)**:
   - Target Path: `/enquiries/invalid$id!with*special*chars`
   *Rejected by `isValidId(enquiryId)`.*

7. **Payload 07 — Denial of Wallet Oversized Description (> 2000 chars)**:
   ```json
   {
     "projectDescription": "A...[2500 characters]...A"
   }
   ```
   *Rejected by `data.projectDescription.size() <= 2000`.*

8. **Payload 08 — Client-Forged Past/Future Timestamp**:
   ```json
   {
     "createdAt": "2020-01-01T00:00:00Z"
   }
   ```
   *Rejected by `incoming().createdAt == request.time`.*

9. **Payload 09 — Immortal Field Mutation (`ownerId` or `createdAt` change on update)**:
   ```json
   {
     "ownerId": "new_owner_uid",
     "updatedAt": "SERVER_TIMESTAMP"
   }
   ```
   *Rejected by `incoming().ownerId == existing().ownerId` and `affectedKeys().hasOnly(...)`.*

10. **Payload 10 — Terminal State Unlocking (Updating a `completed` Enquiry as Owner)**:
    - Existing doc has `status: "completed"`.
    - Owner attempts update `{ projectDescription: "Modified scope after completion", updatedAt: "SERVER_TIMESTAMP" }`.
    *Rejected by Terminal State Lock (`!(existing().status in ['completed', 'archived'])`).*

11. **Payload 11 — Value Poisoning on Update (Invalid Enum on `interestedService` or `status`)**:
    ```json
    {
      "status": "hacked_status",
      "updatedAt": "SERVER_TIMESTAMP"
    }
    ```
    *Rejected because `isValidEnquiry(incoming())` wraps the entire `allow update` block.*

12. **Payload 12 — Self-Assigned Admin Privilege Escalation**:
    - Action: `create` `/admins/attacker_uid` with `{ email: "attacker@evil.com", createdAt: "SERVER_TIMESTAMP" }`
    *Rejected because `/admins/{adminId}` forbids client `create`, `update`, and `delete` (`allow create, update, delete: if false;`).*
