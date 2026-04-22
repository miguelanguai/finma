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
    if (this.categorias.length === 0) {
      this.chartData = null;
      return;
    }

    const labels = this.categorias[0].gastos_por_mes.map(g => g.periodo);
    const datasets = this.categorias.map((cat, i) => ({
      label: cat.categoria.nombre,
      data: cat.gastos_por_mes.map(g => g.gasto),
      backgroundColor: this.COLORES[i % this.COLORES.length],
    }));

    this.chartData = { labels, datasets };
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
