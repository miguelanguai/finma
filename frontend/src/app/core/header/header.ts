import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { LandingPage } from '../../home/landing-page/landing-page';
import { PeriodoList } from '../../periodo/periodo-list/periodo-list';
import { CategoriaList } from '../../categoria/categoria-list/categoria-list';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  routes: Routes = [
    {
      path: '',
      component: LandingPage,
      title: "Home"
    },
    {
      path: 'periodo',
      component: PeriodoList,
      title: "Periodo"
    },
    {
      path: 'categoria',
      component: CategoriaList,
      title: "Categoria"
    },
  ];
}
