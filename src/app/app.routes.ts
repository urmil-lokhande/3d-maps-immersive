import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'home', loadComponent: () => import('./map/map.component').then((c) => c.MapComponent)
    },
    {
        path:'instructions', loadComponent: () => import('./landing/landing.component').then((c) => c.LandingComponent)
    },
    {
        path: '', redirectTo: 'instructions', pathMatch: 'full'
    },
    {
        path: '**', redirectTo: 'instructions', pathMatch: 'full'
    }
];
