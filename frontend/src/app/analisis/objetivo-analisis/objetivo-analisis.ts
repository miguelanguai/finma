import { Component, Input } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';

import { ProgresoObjetivoResponse } from '../analisis-response';

@Component({
  selector: 'app-objetivo-analisis',
  imports: [DatePipe, DecimalPipe, NgClass, ProgressBarModule, RouterLink, TableModule],
  templateUrl: './objetivo-analisis.html',
  styleUrl: './objetivo-analisis.css',
})
export class ObjetivoAnalisis {
  @Input() objetivos: ProgresoObjetivoResponse[] = [];

  esCumplido(obj: ProgresoObjetivoResponse): boolean {
    return obj.porcentaje >= 100;
  }
}
