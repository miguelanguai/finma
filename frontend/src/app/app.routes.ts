import { Routes } from '@angular/router';
import { LandingPage } from './home/landing-page/landing-page';
import { PeriodoList } from './periodo/periodo-list/periodo-list';
import { CategoriaList } from './categoria/categoria-list/categoria-list';
import { MovimientoList } from './movimiento/movimiento-list/movimiento-list';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage
    },
    {
        path: 'periodo',
        component: PeriodoList
    },
    {
        path: 'categoria',
        component: CategoriaList
    },
    {
        path: 'movimiento',
        component: MovimientoList
    },
    {
        path: 'objetivo',
        loadComponent: () => import('./objetivo/objetivo-list/objetivo-list').then(m => m.ObjetivoList)
    },
    {
        path: 'analisis',
        loadComponent: () => import('./analisis/analisis/analisis').then(m => m.Analisis)
    },
];
