import CryptoJS from "crypto-js";

export const encryptNote = (text, password) => {
  return CryptoJS.AES.encrypt(text, password).toString();
};

export const decryptNote = (cipherText, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch (err) {
    console.error("Error during decryption:", err);
    return null;
  }
};
