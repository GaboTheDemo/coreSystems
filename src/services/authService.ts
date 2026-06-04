// src/services/authService.ts
import { supabase } from '../lib/supabaseClient';
import type { User } from '../types';

// ─── Mapea el perfil de Supabase al tipo User de la app ──────────────────────
const mapProfile = (profile: Record<string, unknown>): User => ({
  id:        profile.id as string,
  name:      (profile.full_name as string) ?? '',
  email:     profile.email as string,
  phone:     (profile.phone as string) ?? '',
  role:      (profile.role as 'buyer' | 'seller') ?? 'buyer',
  createdAt: profile.created_at as string,
});

// ─── Login con magic link (OTP por email) ────────────────────────────────────
// shouldCreateUser: true → si no existe lo crea, si existe solo hace login
// Supabase maneja esto solo: no crea duplicados
export async function sendMagicLink(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // si ya existe → login; si no → registro
    },
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Verificar el OTP que llegó al email ─────────────────────────────────────
export async function verifyOtp(
  email: string,
  token: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error || !data.user) return { success: false, error: error?.message ?? 'Token inválido' };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) return { success: false, error: profileError.message };
  return { success: true, user: mapProfile(profile) };
}

// ─── OAuth (Google / Facebook) ───────────────────────────────────────────────
export async function loginWithProvider(
  provider: 'google' | 'facebook'
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ─── Callback OAuth — llamar desde AuthCallbackPage ──────────────────────────
// Supabase pone el token en la URL (#access_token=... o ?code=...)
// exchangeCodeForSession lo procesa y establece la sesión automáticamente
export async function handleAuthCallback(): Promise<{ success: boolean; user?: User; error?: string }> {
  // Para el flujo PKCE (por defecto en Supabase v2), exchangeCodeForSession
  // lee el `code` de la URL actual y lo canjea por una sesión
  const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

  if (error || !data.session) {
    // Si ya había sesión activa (e.g. recarga), intentar obtenerla directamente
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: error?.message ?? 'Sin sesión' };

    const user = await getCurrentUser();
    return user ? { success: true, user } : { success: false, error: 'Perfil no encontrado' };
  }

  const user = await getCurrentUser();
  return user ? { success: true, user } : { success: false, error: 'Perfil no encontrado' };
}

// ─── Sesión activa ────────────────────────────────────────────────────────────
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile ? mapProfile(profile) : null;
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

// ─── Upgrade buyer → seller ───────────────────────────────────────────────────
export async function upgradeToSeller(
  userId: string,
  username: string,
  storeName: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user?.email) return { success: false, error: 'No autenticado' };

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (signInError) return { success: false, error: 'Contraseña incorrecta' };

  const { data, error: rpcError } = await supabase.rpc('upgrade_to_seller', {
    p_user_id:    userId,
    p_username:   username,
    p_store_name: storeName,
  });
  if (rpcError) return { success: false, error: rpcError.message };
  if (!data?.success) return { success: false, error: data?.error ?? 'Error desconocido' };

  return { success: true };
}

// ─── Validación de formato ────────────────────────────────────────────────────
export function validateIdentifier(value: string): string | null {
  if (!value.trim()) return 'Este campo es requerido.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Ingresa un email válido.';
  return null;
}