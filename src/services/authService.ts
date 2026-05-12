// src/services/authService.ts
// Handles authentication logic: email/phone login and OAuth providers.
// This version DINAMICALLY creates a user based on input for better testing.

import type { User, LoginFormData, AuthProvider } from "../types";

const MOCK_DELAY = 800;

/** 
 * Helper para formatear el nombre basado en el input.
 * Si es email, toma lo anterior al @. Si es teléfono, lo deja igual.
 */
const formatNameFromIdentifier = (identifier: string): string => {
  if (identifier.includes('@')) {
    const namePart = identifier.split('@')[0];
    // Capitaliza la primera letra (ej: 'juan' -> 'Juan')
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }
  return `User ${identifier.slice(-4)}`; // Si es teléfono, usa los últimos 4 dígitos
};

/** Simulate email/phone identifier check */
export async function loginWithIdentifier(
  data: LoginFormData
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));

  const iden = data.identifier.trim();

  if (!iden || iden.length < 5) {
    return { success: false, error: "Por favor ingresa un email o teléfono válido." };
  }

  // CREACIÓN DINÁMICA: Ya no usamos el mockUser quemado arriba.
  const dynamicUser: User = {
    id: `usr_${Math.random().toString(36).substring(2, 9)}`,
    name: formatNameFromIdentifier(iden),
    email: iden.includes('@') ? iden : "no-email@test.com",
    phone: !iden.includes('@') ? iden : "+00 000 000 000",
    createdAt: new Date().toISOString(),
  };

  return { success: true, user: dynamicUser };
}

/** Simulate OAuth provider login */
export async function loginWithProvider(
  provider: AuthProvider
): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));

  // Para Google/Facebook también generamos un usuario genérico según el proveedor
  const providerUser: User = {
    id: `oauth_${provider}_${Math.random().toString(36).substring(2, 6)}`,
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    email: `${provider}@example.com`,
    phone: "+00 000 000 000",
    createdAt: new Date().toISOString(),
  };

  console.log(`[AuthService] OAuth login with: ${provider}`);
  return { success: true, user: providerUser };
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