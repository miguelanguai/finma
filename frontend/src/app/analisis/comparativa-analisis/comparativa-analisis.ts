import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

import { Periodo } from '../../periodo/periodo';
import { AnalisisService } from '../analisis-service';
import { ComparativaCategoriaItem, ComparativaResponse } from '../analisis-response';

@Component({
  selector: 'app-comparativa-analisis',
  imports: [
    ButtonModule, ChartModule, DecimalPipe, FormsModule,
    NgClass, SelectModule, SkeletonModule, TableModule,
  ],
  templateUrl: './comparativa-analisis.html',
  styleUrl: './comparativa-analisis.css',
})
export class ComparativaAnalisis implements OnChanges {
  @Input() periodos: Periodo[] = [];

  periodo1: Periodo | null = null;
  periodo2: Periodo | null = null;

  resultado: ComparativaResponse | null = null;
  cargando = false;
  error = false;

  chartData: any = null;
  chartOptions: any = null;

  private readonly COLOR1 = '#4e79a7';
  private readonly COLOR2 = '#f28e2b';

  constructor(
    private analisisService: AnalisisService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['periodos'] && this.periodos.length > 0) {
      // Defer to avoid NG0100: PrimeNG's p-select ngModel may emit during CD
      setTimeout(() => {
        this.periodo1 = null;
        this.periodo2 = null;
        this.resultado = null;
        this.cdr.detectChanges();
      });
    }
  }

  get puedeComparar(): boolean {
    return (
      this.periodo1 !== null &&
      this.periodo2 !== null &&
      this.periodo1.id !== this.periodo2.id
    );
  }

  comparar(): void {
    if (!this.puedeComparar) return;
    this.cargando = true;
    this.error = false;
    this.resultado = null;
    this.cdr.detectChanges();

    this.analisisService
      .getComparativa(this.periodo1!.id!, this.periodo2!.id!)
      .subscribe({
        next: (data) => {
          this.resultado = data;
          this.buildChart(data);
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = true;
          this.cargando = false;
          this.cdr.detectChanges();
        },
      });
  }

  private buildChart(data: ComparativaResponse): void {
    const labels = data.categorias.map(c => c.categoria.nombre);
    this.chartData = {
      labels,
      datasets: [
        {
          label: data.periodo1.nombre,
          data: data.categorias.map(c => c.gasto_periodo1),
          backgroundColor: this.COLOR1,
        },
        {
          label: data.periodo2.nombre,
          data: data.categorias.map(c => c.gasto_periodo2),
          backgroundColor: this.COLOR2,
        },
      ],
    };
    this.chartOptions = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true, stacked: false },
      },
    };
  }

  diferenciaClase(item: ComparativaCategoriaItem): string {
    if (item.diferencia_porcentual === null) return '';
    return item.diferencia_porcentual > 0 ? 'dif-sube' : item.diferencia_porcentual < 0 ? 'dif-baja' : '';
  }

  diferenciaTexto(item: ComparativaCategoriaItem): string {
    if (item.diferencia_porcentual === null) return '—';
    const signo = item.diferencia_porcentual > 0 ? '+' : '';
    return `${signo}${item.diferencia_porcentual.toFixed(1)} %`;
  }
}
