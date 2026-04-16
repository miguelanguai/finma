import { Component, OnInit } from '@angular/core';

import { SkeletonModule } from 'primeng/skeleton';

import { AnalisisService } from '../../analisis/analisis-service';
import { ResumenLandingResponse } from '../../analisis/analisis-response';
import { KpiLanding } from '../kpi-landing/kpi-landing';
import { UltimosMovimientos } from '../ultimos-movimientos/ultimos-movimientos';
import { ObjetivosResumen } from '../objetivos-resumen/objetivos-resumen';
import { AccesosRapidos } from '../accesos-rapidos/accesos-rapidos';

@Component({
  selector: 'app-landing-page',
  imports: [SkeletonModule, KpiLanding, UltimosMovimientos, ObjetivosResumen, AccesosRapidos],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  resumen: ResumenLandingResponse | null = null;
  cargando = false;
  error = false;

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.analisisService.getResumen().subscribe({
      next: (data) => {
        this.resumen = data;
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }
}
