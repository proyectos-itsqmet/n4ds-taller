import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '../../models/title';
import { Favorite } from '../../models/favorite';
import { TitleService } from '../../services/title-service';
import { FavoriteService } from '../../services/favorite-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private titleService = inject(TitleService);
  private favoriteService = inject(FavoriteService);
  authService = inject(AuthService);

  titles = signal<Title[]>([]);
  favoriteTitleIds = signal<number[]>([]);
  typeFilter = signal<'ALL' | 'MOVIE' | 'SERIES'>('ALL');

  filteredTitles = computed(() => {
    const filter = this.typeFilter();
    return filter === 'ALL' ? this.titles() : this.titles().filter((t) => t.type === filter);
  });

  ngOnInit() {
    this.titleService.getTitles().subscribe({
      next: (data) => this.titles.set(data),
      error: () => alert('No se pudo cargar el catálogo. ¿Está corriendo json-server?'),
    });
    if (this.authService.currentRol() === 'USER') {
      this.loadFavorites();
    }
  }

  async loadFavorites() {
    const userId = this.authService.currentUser()?.id;
    if (userId === undefined) {
      return;
    }
    try {
      const favorites = await this.favoriteService.getFavorites(userId);
      this.favoriteTitleIds.set(favorites.map((f) => f.title_id));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  isFavorite(titleId?: number): boolean {
    return titleId !== undefined && this.favoriteTitleIds().includes(titleId);
  }

  async addFavorite(title: Title) {
    const userId = this.authService.currentUser()?.id;
    if (userId === undefined || title.id === undefined) {
      return;
    }
    const titleId = title.id;
    const favorite: Favorite = {
      user_id: userId,
      title_id: titleId,
      title_name: title.name,
      title_type: title.type,
      poster_url: title.posterUrl,
    };
    try {
      await this.favoriteService.addFavorite(favorite);
      this.favoriteTitleIds.update((ids) => [...ids, titleId]);
    } catch (e) {
      alert((e as Error).message);
    }
  }
}
