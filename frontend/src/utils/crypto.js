/**
 * crypto.js
 * 
 * This is our "Secret Agent Toolbox." 
 * It uses the Web Crypto API, which is a set of tools built directly 
 * into your web browser for doing heavy-duty math and security.
 */

/**
 * 1. THE BLENDER (Key Derivation - PBKDF2)
 * 
 * Turning a password like "pizza123" into a high-security key.
 * 
 * @param {string} password - The password the user typed.
 * @param {string} salt - A random string (usually the room ID) to make the key unique.
 */
export async function deriveKeyFromPassword(password, salt) {
  const encoder = new TextEncoder();
  
  // Convert our text password into raw data (bytes)
  const passwordData = encoder.encode(password);
  
  // Step A: Import the password as a "base" key
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordData,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Step B: Run the blender! 
  // We use 100,000 iterations to make it "slow" for hackers to guess, 
  // but it still feels instant for a normal user.
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 }, // We want a strong 256-bit AES key
    false,                            // Don't let the key leave the browser (security!)
    ["encrypt", "decrypt"]            // What we are allowed to do with this key
  );
}

/**
 * 2. THE LOCK (Encryption - AES-GCM)
 * 
 * Takes your message and locks it so only the key can open it.
 * 
 * @param {string} plainText - The message you want to send.
 * @param {CryptoKey} key - The strong key we got from the "blender."
 */
export async function encryptMessage(plainText, key, customIv = null) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  
  // The IV (Initialization Vector) is a random "start position" for the lock.
  // It MUST be different for every single message.
  const iv = customIv || crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  // We return the scrambled data and the IV as Base64 strings (easy to send over the web).
  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

/**
 * 3. THE KEYHOLE (Decryption - AES-GCM)
 * 
 * Takes scrambled data and uses the key to turn it back into text.
 */
export async function decryptMessage(encryptedDataBase64, ivBase64, key) {
  // Turn the Base64 strings back into raw bytes
  const encryptedData = Uint8Array.from(atob(encryptedDataBase64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (e) {
    // If the password or key is wrong, the browser throws an error.
    console.error("Decryption failed! The key or data might be wrong.", e);
    return null;
  }
}

/**
 * 4. THE VAULT (File Encryption)
 * 
 * Scrambles a file into a ciphertext blob.
 */
export async function encryptFile(file, key) {
  const arrayBuffer = await file.arrayBuffer();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    arrayBuffer
  );

  return {
    encryptedBlob: new Blob([encryptedBuffer]),
    iv: btoa(String.fromCharCode(...iv))
  };
}

/**
 * 5. THE SKELETON KEY (File Decryption)
 * 
 * Turns a ciphertext buffer back into a usable ArrayBuffer.
 */
export async function decryptFile(encryptedBuffer, ivBase64, key) {
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));

  try {
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      encryptedBuffer
    );
    return decryptedBuffer;
  } catch (e) {
    console.error("File decryption failed:", e);
    return null;
  }
}
