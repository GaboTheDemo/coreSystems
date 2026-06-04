import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ectixbfrppwvtoylcjok.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjdGl4YmZycHB3dnRveWxjam9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzg3MDAsImV4cCI6MjA5NTY1NDcwMH0.nGMczstOjZeh04YUOqCmh-U7flLtn0QhKEzGJP0UNB8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);