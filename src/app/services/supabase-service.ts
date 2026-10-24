import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../configs/config';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  get client(): SupabaseClient {
    if (!this.supabase) {
      const { url, key } = supabaseConfig;
      if (url === 'PROJECT_URL' || key === 'PUBLISHABLE_KEY') {
        throw new Error('Supabase no está configurado. Edita src/app/configs/config.ts');
      }
      this.supabase = createClient(url, key);
    }
    return this.supabase;
  }
}
