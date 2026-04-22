import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

import { AnalisisService } from '../../analisis/analisis-service';
import { GastoCategoriaLandingItem } from '../../analisis/analisis-response';

type Vista = 'periodo' | 'anio';

@Component({
  selector: 'app-movimientos-categoria',
  imports: [ChartModule, FormsModule, SelectButtonModule, SkeletonModule],
  templateUrl: './movimientos-categoria.html',
  styleUrl: './movimientos-categoria.css',
})
export class MovimientosCategoria implements OnChanges, OnInit {
  @Input() gastosPeriodo: GastoCategoriaLandingItem[] = [];
  @Input() anio: number = new Date().getFullYear();
  @Input() nombrePeriodo: string = 'Período activo';

  vista: Vista = 'periodo';
  vistaOpciones = [
    { label: 'Período', value: 'periodo' as Vista },
    { label: 'Año', value: 'anio' as Vista },
  ];

  chartData: any = null;
  chartOptions: any = null;
  cargandoAnio = false;

  private gastosAnio: { categoria: string; total: number }[] = [];

  private readonly COLOR_BARRAS = '#4e79a7';

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gastosPeriodo'] && this.vista === 'periodo') {
      this.buildChart();
    }
  }

  onVistaChange(vista: Vista): void {
    this.vista = vista;
    if (vista === 'anio' && this.gastosAnio.length === 0) {
      this.cargarAnio();
    } else {
      this.buildChart();
    }
  }

  private cargarAnio(): void {
    this.cargandoAnio = true;
    this.analisisService.getGastosCategorias(this.anio).subscribe({
      next: (data) => {
        this.gastosAnio = data
          .filter(c => c.gasto_anual > 0)
          .sort((a, b) => b.gasto_anual - a.gasto_anual)
          .map(c => ({ categoria: c.categoria.nombre, total: c.gasto_anual }));
        this.cargandoAnio = false;
        this.buildChart();
      },
      error: () => {
        this.cargandoAnio = false;
      },
    });
  }

  private buildChart(): void {
    const datos = this.vista === 'periodo' ? this.gastosPeriodo : this.gastosAnio;

    if (datos.length === 0) {
      this.chartData = null;
      return;
    }

    this.chartData = {
      labels: datos.map(d => d.categoria),
      datasets: [{
        data: datos.map(d => d.total),
        backgroundColor: this.COLOR_BARRAS,
        borderRadius: 4,
      }],
    };

    this.chartOptions = {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      responsive: true,
      scales: {
        x: { beginAtZero: true, ticks: { callback: (v: number) => v + ' €' } },
        y: { ticks: { font: { size: 12 } } },
      },
    };
  }
}
