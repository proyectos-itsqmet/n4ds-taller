import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '../../models/title';
import { TitleService } from '../../services/title-service';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private titleService = inject(TitleService);

  list = signal<Title[]>([]);
  newItem: Title = this.emptyItem();
  editing = false;

  ngOnInit() {
    this.load();
  }

  private emptyItem(): Title {
    return { name: '', type: 'MOVIE', year: 2024, genre: '', synopsis: '', rating: 5, posterUrl: '' };
  }

  load() {
    this.titleService.getTitles().subscribe({
      next: (data) => this.list.set(data),
      error: () => alert('No se pudo cargar los títulos. ¿Está corriendo json-server?'),
    });
  }

  selectForEdit(item: Title) {
    this.editing = true;
    this.newItem = { ...item };
  }

  save() {
    const request =
      this.editing && this.newItem.id !== undefined
        ? this.titleService.putTitle(this.newItem.id, this.newItem)
        : this.titleService.postTitle(this.newItem);
    request.subscribe({
      next: () => {
        this.load();
        this.reset();
      },
      error: () => alert('No se pudo guardar el título'),
    });
  }

  delete(id?: number) {
    if (id === undefined || !confirm('¿Desea eliminar el registro?')) {
      return;
    }
    this.titleService.deleteTitle(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el título'),
    });
  }

  reset() {
    this.editing = false;
    this.newItem = this.emptyItem();
  }
}
