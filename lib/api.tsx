 
// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // 1. Initialize Headers
  const headers = new Headers(options.headers);

  // 2. Set default Content-Type if not provided
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Read token safely from BOTH storages (Client-side only)
  let token = null;
  if (typeof window !== "undefined") {
    // អាទិភាពទី១ យកពី sessionStorage (បើ user ចុច Remember Me ពេលខ្លះគេទុកនៅហ្នឹង)
    // បើអត់មាន ទើបយកពី localStorage
    token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
  }

  // 4. Safely attach Authorization header ONLY if it's a valid string
  if (token && token !== "null" && token !== "undefined") {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 5. Execute the fetch request
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 6. Handle 401 Unauthorized (Token Expired or Invalid)
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      // Redirect ទៅទំព័រ Login (ប្រើ window.location ដើម្បី clear state ទាំងអស់)
      window.location.href = "/login"; 
    }
    // Stop execution and throw error so the calling function knows it failed
    throw new Error("Session expired. Please login again."); 
  }

  // 7. Handle other HTTP errors
  if (!response.ok) {
    // ចាប់យក Error message ពី Spring Boot ApiResponse (បើមាន)
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  // 8. Handle successful empty responses (e.g., DELETE or simple PUT)
  if (response.status === 204) {
    return null;
  }

  // 9. Return parsed JSON for successful responses
  return response.json();
}