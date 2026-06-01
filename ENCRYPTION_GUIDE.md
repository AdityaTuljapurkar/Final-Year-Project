# End-to-End Encryption (E2EE) Implementation Guide

This document explains how the E2EE file and message sharing system was achieved in this project.

## 1. Overview
The system ensures that sensitive data (chat messages and file attachments) is encrypted on the client side before being sent to the server. The server only sees encrypted blobs (ciphertext) and has no way to decrypt them, as it doesn't possess the encryption keys.

## 2. Key Derivation (PBKDF2)
Instead of using the raw room password directly as an encryption key, we use **PBKDF2 (Password-Based Key Derivation Function 2)**.
- **Salt:** The `room_id` is used as a salt to ensure that even if two rooms have the same password, their encryption keys will be different.
- **Iterations:** 100,000 iterations of SHA-256 hashing make it computationally expensive for an attacker to brute-force the password.
- **Result:** A 256-bit AES-GCM key.

```javascript
// From frontend/src/utils/crypto.js
const baseKey = await crypto.subtle.importKey("raw", passwordData, "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
);
```

## 3. Symmetric Encryption (AES-GCM)
We use **AES-GCM (Advanced Encryption Standard in Galois/Counter Mode)** for both text and files. AES-GCM provides both confidentiality and integrity (it detects if the data was tampered with).

### Text Messaging
1. The message is encoded into bytes.
2. A random 12-byte **Initialization Vector (IV)** is generated.
3. The data is encrypted using the IV and the room key.
4. The ciphertext and IV (both Base64 encoded) are sent to the server via WebSocket.

### File Sharing
1. The file is read as an `ArrayBuffer`.
2. A random 12-byte IV is generated.
3. The entire `ArrayBuffer` is encrypted.
4. The encrypted buffer is sent as a `Blob` via a `multipart/form-data` POST request to `/api/messages/upload/`.
5. The server stores this scrambled blob in the filesystem.

## 4. Decryption Process
When a client receives an encrypted message or file:
1. It retrieves the ciphertext and the IV.
2. It uses the stored `roomKey` (derived when the user entered the password) to decrypt the data.
3. **Lazy Decryption:** For files, the `FileRenderer` component fetches the encrypted blob from the server, decrypts it in memory, and creates a temporary `Blob URL` using `URL.createObjectURL` for display or download.

## 5. Security Summary
- **No Private Keys on Server:** The server never receives the room password or the derived key.
- **Unique IVs:** Every single message and file uses a fresh random IV, preventing patterns from appearing in the ciphertext.
- **Memory Safety:** Decrypted data only exists in the browser's volatile memory and is never saved to the local disk in plaintext by the application.

---
*Developed as part of the Final Year Project File Sharing System Upgrade.*
