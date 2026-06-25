import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';

import { ChartModule } from 'primeng/chart';

import { BalanceAnualResponse, BalanceRollingResponse } from '../analisis-response';

@Component({
  selector: 'app-balance-analisis',
  imports: [ChartModule, DecimalPipe, NgClass],
  templateUrl: './balance-analisis.html',
  styleUrl: './balance-analisis.css',
})
export class BalanceAnalisis implements OnChanges {
  @Input() anio: number = new Date().getFullYear();
  @Input() balance: BalanceAnualResponse | null = null;
  @Input() balanceRolling: BalanceRollingResponse | null = null;

  chartData: any = null;
  chartOptions: any = null;
  rollingChartData: any = null;
  rollingChartOptions: any = null;

  private readonly MESES_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['balance'] || changes['anio']) {
      this.buildChart();
    }
    if (changes['balanceRolling']) {
      this.buildRollingChart();
    }
  }

  private buildChart(): void {
    if (!this.balance) return;

    const mesesOrdenados = [...this.balance.balance_por_mes].sort((a, b) =>
      a.periodo.localeCompare(b.periodo)
    );
    const closedCount = mesesOrdenados.length;
    const remaining = 12 - closedCount;

    const realData: (number | null)[] = new Array(12).fill(null);
    let cumulative = 0;
    mesesOrdenados.forEach(m => {
      const mesIdx = parseInt(m.periodo.split('-')[1]) - 1;
      cumulative += m.balance;
      realData[mesIdx] = cumulative;
    });

    const mediaData: (number | null)[] = new Array(12).fill(null);
    const minimaData: (number | null)[] = new Array(12).fill(null);
    const maximaData: (number | null)[] = new Array(12).fill(null);

    if (remaining > 0 && closedCount > 0) {
      const lastReal = realData[closedCount - 1] ?? 0;
      const perMonth = {
        media: this.balance.prev_media / remaining,
        minima: this.balance.prev_minima / remaining,
        maxima: this.balance.prev_maxima / remaining,
      };

      mediaData[closedCount - 1] = lastReal;
      minimaData[closedCount - 1] = lastReal;
      maximaData[closedCount - 1] = lastReal;

      for (let i = closedCount; i < 12; i++) {
        const delta = i - closedCount + 1;
        mediaData[i] = lastReal + perMonth.media * delta;
        minimaData[i] = lastReal + perMonth.minima * delta;
        maximaData[i] = lastReal + perMonth.maxima * delta;
      }
    }

    this.chartData = {
      labels: this.MESES_LABELS,
      datasets: [
        {
          label: 'Real (acumulado)',
          data: realData,
          borderColor: '#4e79a7',
          backgroundColor: 'rgba(78,121,167,0.15)',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Prev. media',
          data: mediaData,
          borderColor: '#59a14f',
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Prev. mínima',
          data: minimaData,
          borderColor: '#e15759',
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Prev. máxima',
          data: maximaData,
          borderColor: '#f28e2b',
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
        },
      ],
    };

    this.chartOptions = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      spanGaps: false,
      scales: { y: { beginAtZero: false } },
    };
  }

  private buildRollingChart(): void {
    if (!this.balanceRolling) return;

    const pasados = this.balanceRolling.meses_pasados;
    const futuros = this.balanceRolling.meses_futuros;
    const nPast = pasados.length;

    const labels = [
      ...pasados.map(m => this.shortLabel(m.periodo)),
      ...futuros.map(m => this.shortLabel(m.periodo)),
    ];

    const realData: (number | null)[] = [
      ...pasados.map(m => m.balance),
      ...new Array(futuros.length).fill(null),
    ];

    const fijoData: (number | null)[] = new Array(nPast + futuros.length).fill(null);
    const estimadoData: (number | null)[] = new Array(nPast + futuros.length).fill(null);

    if (nPast > 0) {
      const lastReal = pasados[nPast - 1].balance;
      fijoData[nPast - 1] = lastReal;
      estimadoData[nPast - 1] = lastReal;
    }

    futuros.forEach((m, i) => {
      fijoData[nPast + i] = m.balance_fijo;
      estimadoData[nPast + i] = m.balance_estimado;
    });

    this.rollingChartData = {
      labels,
      datasets: [
        {
          label: 'Real',
          data: realData,
          borderColor: '#4e79a7',
          backgroundColor: 'rgba(78,121,167,0.15)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Prev. fijo',
          data: fijoData,
          borderColor: '#e15759',
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: 'Prev. estimado',
          data: estimadoData,
          borderColor: '#59a14f',
          borderDash: [6, 4],
          fill: false,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    };

    this.rollingChartOptions = {
      plugins: { legend: { position: 'bottom' } },
      responsive: true,
      spanGaps: false,
      scales: { y: { beginAtZero: false } },
    };
  }

  private shortLabel(nombre: string): string {
    const partes = nombre.split(' ');
    if (partes.length === 2) {
      const mes = partes[1].slice(0, 3);
      const anio = partes[0].slice(2);
      return `${mes} ${anio}`;
    }
    return nombre;
  }

  get totalPrevFijo(): number {
    return this.balanceRolling?.meses_futuros.reduce((s, m) => s + m.balance_fijo, 0) ?? 0;
  }

  get totalPrevEstimado(): number {
    return this.balanceRolling?.meses_futuros.reduce((s, m) => s + m.balance_estimado, 0) ?? 0;
  }
}
