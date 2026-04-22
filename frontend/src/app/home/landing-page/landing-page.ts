import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AnalisisService } from '../../analisis/analisis-service';
import { ResumenLandingResponse } from '../../analisis/analisis-response';
import { KpiLanding } from '../kpi-landing/kpi-landing';
import { UltimosMovimientos } from '../ultimos-movimientos/ultimos-movimientos';
import { ObjetivosResumen } from '../objetivos-resumen/objetivos-resumen';
import { AccesosRapidos } from '../accesos-rapidos/accesos-rapidos';
import { MovimientosCategoria } from '../movimientos-categoria/movimientos-categoria';
import { BalanceGeneral } from '../balance-general/balance-general';

@Component({
  selector: 'app-landing-page',
  imports: [KpiLanding, UltimosMovimientos, ObjetivosResumen, AccesosRapidos, MovimientosCategoria, BalanceGeneral],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  resumen: ResumenLandingResponse | null = null;
  error = false;
  anioActual = new Date().getFullYear();

  constructor(
    private analisisService: AnalisisService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.analisisService.getResumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.cdr.detectChanges();
      },
    });
  }
}
