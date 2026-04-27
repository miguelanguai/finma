import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  path: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    { path: '/',           title: 'Inicio',      icon: 'pi-home' },
    { path: '/movimiento', title: 'Movimientos', icon: 'pi-arrows-v' },
    { path: '/analisis',   title: 'Análisis',    icon: 'pi-chart-bar' },
    { path: '/objetivo',   title: 'Objetivos',   icon: 'pi-bullseye' },
    { path: '/categoria',  title: 'Categorías',  icon: 'pi-tags' },
    { path: '/periodo',    title: 'Períodos',    icon: 'pi-calendar' },
  ];

  toggle(): void {
    this.collapsedChange.emit(!this.collapsed);
  }
}
