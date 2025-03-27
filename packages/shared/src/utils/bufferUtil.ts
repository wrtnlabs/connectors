/**
 * Converts a Buffer to a Base64-encoded string.
 * @param buffer - The Buffer to encode.
 * @returns A Base64-encoded string.
 * @author Asher
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

/**
 * Converts a Base64-encoded string to a Buffer.
 * @param base64 - The Base64 string to decode.
 * @returns A Buffer containing the decoded data.
 * @throws {Error} If the Base64 string is invalid or empty.
 * @author Asher
 */
export function base64ToBuffer(base64: string): Buffer {
  try {
    return Buffer.from(base64, "base64");
  } catch (error) {
    throw new Error("Invalid Base64 string provided");
  }
}
