import { Component, inject, OnInit, signal } from '@angular/core';
import { Favorite } from '../../models/favorite';
import { FavoriteService } from '../../services/favorite-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-favorites',
  imports: [],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  favorites = signal<Favorite[]>([]);

  ngOnInit() {
    this.load();
  }

  async load() {
    const userId = this.authService.currentUser()?.id;
    if (userId === undefined) {
      return;
    }
    try {
      this.favorites.set(await this.favoriteService.getFavorites(userId));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  async remove(favorite: Favorite) {
    if (favorite.id === undefined || !confirm('¿Desea quitar este título de sus favoritos?')) {
      return;
    }
    try {
      await this.favoriteService.removeFavorite(favorite.id);
      this.favorites.update((list) => list.filter((f) => f.id !== favorite.id));
    } catch (e) {
      alert((e as Error).message);
    }
  }
}
