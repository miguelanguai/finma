import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';

import { GastoCategoriaResponse } from '../analisis-response';

@Component({
  selector: 'app-categoria-analisis',
  imports: [ChartModule, DecimalPipe, FormsModule, SelectButtonModule, TableModule, TabsModule],
  templateUrl: './categoria-analisis.html',
  styleUrl: './categoria-analisis.css',
})
export class CategoriaAnalisis implements OnChanges {
  @Input() anio: number = new Date().getFullYear();
  @Input() categorias: GastoCategoriaResponse[] = [];

  chartData: any = null;
  chartOptions: any = null;

  apilado = false;
  modoOpciones = [
    { label: 'Agrupado', value: false },
    { label: 'Apilado', value: true },
  ];

  private readonly MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  private readonly COLORES = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
    '#edc948', '#b07aa1', '#ff9da7', '#9c755f', '#bab0ac',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categorias'] || changes['anio']) {
      this.buildChart();
    }
  }

  onModoChange(apilado: boolean): void {
    this.apilado = apilado;
    this.buildChart();
  }

  private buildChart(): void {
    const datasets = this.categorias.map((cat, i) => ({
      label: cat.categoria_path ?? cat.categoria,
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
        x: { stacked: this.apilado },
        y: { beginAtZero: true, stacked: this.apilado },
      },
    };
  }
}
