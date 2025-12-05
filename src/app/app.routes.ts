import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', 
    redirectTo: 'place/null', // null is a placeholder for no place details
    pathMatch: 'full'
  },
  {
    path: 'place/:placeDetails',
    loadComponent: () =>
      import('./place/place.component').then((m) => m.PlaceComponent),
  },
];
