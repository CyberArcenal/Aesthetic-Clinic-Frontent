// src/lib/global.ts

/**
 * Returns the base URL for API requests.
 * @returns A string URL
 */
export function global_base_url(): string {
  const urlLocal = "http://localhost:5285/";
  // const urlRemote = "https://oriented-frank-airedale.ngrok-free.app";
  const serverUrl = "https://fortfollio-system.vercel.app/";

  // For now we always return the local URL.
  return urlLocal;
}