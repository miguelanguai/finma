import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';

import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';

import { AnalisisService } from '../analisis-service';
import { ProgresoObjetivoResponse } from '../analisis-response';

@Component({
  selector: 'app-objetivo-analisis',
  imports: [DatePipe, DecimalPipe, NgClass, ProgressBarModule, TableModule],
  templateUrl: './objetivo-analisis.html',
  styleUrl: './objetivo-analisis.css',
})
export class ObjetivoAnalisis implements OnInit {
  objetivos: ProgresoObjetivoResponse[] = [];

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.analisisService.getProgresoObjetivos().subscribe({
      next: (data) => { this.objetivos = data; },
      error: (err) => console.error(err),
    });
  }

  esCumplido(obj: ProgresoObjetivoResponse): boolean {
    return obj.porcentaje >= 100;
  }
}
