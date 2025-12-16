import { Routes } from '@angular/router';
import { LandingPage } from './home/landing-page/landing-page';
import { PeriodoList } from './periodo/periodo-list/periodo-list';

export const routes: Routes = [
    {
        path: '',
        component: LandingPage
    },
    {
        path: 'periodo',
        component: PeriodoList
    },
];
