export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 600000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptData(plaintext: string, key: CryptoKey): Promise<{ciphertext: string, iv: string}> {
  const enc = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    enc.encode(plaintext)
  );

  return {
    ciphertext: arrayBufferToBase64(encrypted),
    iv: arrayBufferToBase64(iv.buffer)
  };
}

export async function decryptData(ciphertext: string, ivBase64: string, key: CryptoKey): Promise<string> {
  const dec = new TextDecoder();
  const encryptedBuffer = base64ToArrayBuffer(ciphertext);
  const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encryptedBuffer
  );

  return dec.decode(decrypted);
}

export function getOrCreateSalt(): Uint8Array {
  const stored = localStorage.getItem('admitflow_salt');
  if (stored) {
    return new Uint8Array(base64ToArrayBuffer(stored));
  }
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem('admitflow_salt', arrayBufferToBase64(salt.buffer));
  return salt;
}

export async function initializeEncryption(passphrase: string): Promise<CryptoKey> {
  const salt = getOrCreateSalt();
  return await deriveKey(passphrase, salt);
}
