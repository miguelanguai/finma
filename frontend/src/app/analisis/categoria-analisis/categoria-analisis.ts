import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

import { AnalisisService } from '../analisis-service';
import { GastoCategoriaResponse } from '../analisis-response';

@Component({
  selector: 'app-categoria-analisis',
  imports: [ButtonModule, ChartModule, DecimalPipe, FormsModule, InputNumberModule, TableModule, TabsModule],
  templateUrl: './categoria-analisis.html',
  styleUrl: './categoria-analisis.css',
})
export class CategoriaAnalisis implements OnInit {
  anio: number = new Date().getFullYear();
  categorias: GastoCategoriaResponse[] = [];
  chartData: any = null;
  chartOptions: any = null;

  private readonly MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  private readonly COLORES = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
    '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  ];

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.analisisService.getGastosCategorias(this.anio).subscribe({
      next: (data) => {
        this.categorias = data;
        this.buildChart();
      },
      error: (err) => console.error(err),
    });
  }

  private buildChart(): void {
    const datasets = this.categorias.map((cat, i) => ({
      label: cat.categoria,
      data: this.MESES.map((_, mesIdx) => {
        const key = `${this.anio}-${String(mesIdx + 1).padStart(2, '0')}`;
        return cat.gastos_por_mes[key] ?? 0;
      }),
      backgroundColor: this.COLORES[i % this.COLORES.length],
    }));

    this.chartData = { labels: this.MESES, datasets };
    this.chartOptions = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true },
      },
    };
  }
}
