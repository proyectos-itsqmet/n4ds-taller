import { inject, Injectable } from '@angular/core';
import { Favorite } from '../models/favorite';
import { SupabaseService } from './supabase-service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private TABLE = 'favorites';
  private supabaseService = inject(SupabaseService);

  async getFavorites(userId: number): Promise<Favorite[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as Favorite[];
  }

  async addFavorite(favorite: Favorite): Promise<void> {
    const { error } = await this.supabaseService.client.from(this.TABLE).insert(favorite);
    if (error) {
      throw new Error(error.message);
    }
  }

  async removeFavorite(id: number): Promise<void> {
    const { error } = await this.supabaseService.client.from(this.TABLE).delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
}
