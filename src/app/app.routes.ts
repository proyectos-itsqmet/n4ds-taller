import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Catalog } from './features/catalog/catalog';
import { Favorites } from './features/favorites/favorites';
import { Admin } from './features/admin/admin';
import { NotFound } from './features/not-found/not-found';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { userGuard } from './guards/user-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'catalog', component: Catalog, canActivate: [authGuard] },
  { path: 'favorites', component: Favorites, canActivate: [authGuard, userGuard] },
  { path: 'admin', component: Admin, canActivate: [authGuard, adminGuard] },
  { path: '**', component: NotFound },
];
