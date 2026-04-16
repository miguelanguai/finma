import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressBarModule } from 'primeng/progressbar';

import { ProgresoObjetivoResponse } from '../../analisis/analisis-response';

@Component({
  selector: 'app-objetivos-resumen',
  imports: [RouterLink, ProgressBarModule],
  templateUrl: './objetivos-resumen.html',
  styleUrl: './objetivos-resumen.css',
})
export class ObjetivosResumen {
  @Input() objetivos: ProgresoObjetivoResponse[] = [];

  get top3(): ProgresoObjetivoResponse[] {
    return [...this.objetivos]
      .filter(o => o.porcentaje < 100)
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 3);
  }
}
