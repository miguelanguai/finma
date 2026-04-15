import { Component, Input, OnChanges } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

import { ProgressBarModule } from 'primeng/progressbar';

import { Objetivo } from '../Objetivo';
import { MapCategoriaObjetivo } from '../MapCategoriaObjetivo';
import { Movimiento } from '../../movimiento/movimiento';

@Component({
  selector: 'app-objetivo-progress',
  imports: [
    DatePipe,
    DecimalPipe,
    ProgressBarModule,
  ],
  templateUrl: './objetivo-progress.html',
  styleUrl: './objetivo-progress.css',
})
export class ObjetivoProgress implements OnChanges {
  @Input() objetivos: Objetivo[] = [];
  @Input() mapeos: MapCategoriaObjetivo[] = [];
  @Input() movimientos: Movimiento[] = [];

  objetivo: Objetivo | null = null;
  progreso: number = 0;
  acumulado: number = 0;

  ngOnChanges(): void {
    this.calcular();
  }

  private calcular(): void {
    const pendientes = this.objetivos
      .filter(o => !o.is_cumplido)
      .sort((a, b) => {
        const pa = Number(a.prioridad) || Infinity;
        const pb = Number(b.prioridad) || Infinity;
        return pa - pb;
      });

    this.objetivo = pendientes[0] ?? null;
    if (!this.objetivo) {
      this.progreso = 0;
      this.acumulado = 0;
      return;
    }

    const mapeosFiltrados = this.mapeos.filter(
      m => m.objetivo?.id === this.objetivo!.id
    );

    let suma = 0;
    for (const mapeo of mapeosFiltrados) {
      const inicio = new Date(mapeo.fecha_inicio).getTime();
      const fin = new Date(mapeo.fecha_fin).getTime();

      for (const mov of this.movimientos) {
        if (mov.categoria?.id !== mapeo.categoria?.id) continue;
        const fechaMov = new Date(mov.fecha).getTime();
        if (fechaMov >= inicio && fechaMov <= fin) {
          suma += Math.abs(mov.monto ?? 0);
        }
      }
    }

    this.acumulado = suma;
    const monto = this.objetivo.monto ?? 0;
    this.progreso = monto > 0 ? Math.min(100, (suma / monto) * 100) : 0;
  }
}
