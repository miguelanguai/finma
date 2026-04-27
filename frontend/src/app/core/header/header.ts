import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

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
  @Input() collapsed   = false;
  @Input() mobileOpen  = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() mobileClose     = new EventEmitter<void>();

  private router = inject(Router);

  navItems: NavItem[] = [
    { path: '/',           title: 'Inicio',      icon: 'pi-home'      },
    { path: '/movimiento', title: 'Movimientos', icon: 'pi-arrows-v'  },
    { path: '/analisis',   title: 'Análisis',    icon: 'pi-chart-bar' },
    { path: '/objetivo',   title: 'Objetivos',   icon: 'pi-bullseye'  },
    { path: '/categoria',  title: 'Categorías',  icon: 'pi-tags'      },
    { path: '/periodo',    title: 'Períodos',    icon: 'pi-calendar'  },
  ];

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.mobileClose.emit());
  }

  toggle(): void {
    this.collapsedChange.emit(!this.collapsed);
  }
}
