import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = (await cookieStore).get(name);
          return cookie?.value;
        },
  async set(name: string, value: string, options: unknown) {
          try {
            (await cookieStore).set({ name, value, ...(typeof options === 'object' && options !== null ? options : {}) });
          } catch (error) {
            // Handle cookie setting error
            console.error('Error setting cookie:', error);
          }
        },
  async remove(name: string, options: unknown) {
          try {
            (await cookieStore).set({ name, value: '', ...(typeof options === 'object' && options !== null ? options : {}) });
          } catch (error) {
            // Handle cookie removal error
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  );
}
