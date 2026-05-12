// src/services/authService.ts
// Handles authentication logic: email/phone login and OAuth providers.
// Replace fetch calls with real API endpoints once backend is ready.

import type { User, LoginFormData, AuthProvider } from "../types";

const MOCK_DELAY = 800;

const mockUser: User = {
  id: "usr_001",
  name: "Carlos Rodríguez",
  email: "carlos@example.com",
  phone: "+57 300 123 4567",
  createdAt: new Date().toISOString(),
};

/** Simulate email/phone identifier check */
export async function loginWithIdentifier(
  data: LoginFormData
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));

  if (!data.identifier || data.identifier.trim().length < 5) {
    return { success: false, error: "Por favor ingresa un email o teléfono válido." };
  }

  // Mock: accept any valid-looking identifier
  return { success: true, user: mockUser };
}

/** Simulate OAuth provider login */
export async function loginWithProvider(
  provider: AuthProvider
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));

  console.log(`[AuthService] OAuth login with: ${provider}`);
  return { success: true, user: mockUser };
}

/** Validate identifier format */
export function validateIdentifier(value: string): string | null {
  if (!value.trim()) return "Este campo es requerido.";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;

  if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return "Ingresa un email o número de teléfono válido.";
  }
  return null;
}