import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';

import { AnalisisService } from '../analisis-service';
import { BalanceAnualResponse } from '../analisis-response';

@Component({
  selector: 'app-balance-analisis',
  imports: [ButtonModule, ChartModule, DecimalPipe, FormsModule, InputNumberModule],
  templateUrl: './balance-analisis.html',
  styleUrl: './balance-analisis.css',
})
export class BalanceAnalisis implements OnInit {
  anio: number = new Date().getFullYear();
  balance: BalanceAnualResponse | null = null;
  chartData: any = null;
  chartOptions: any = null;

  private readonly MESES_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.analisisService.getBalance(this.anio).subscribe({
      next: (data) => {
        this.balance = data;
        this.buildChart();
      },
      error: (err) => console.error(err),
    });
  }

  private buildChart(): void {
    if (!this.balance) return;

    const realData: (number | null)[] = new Array(12).fill(null);
    this.balance.meses.forEach(m => {
      const mesIdx = parseInt(m.periodo.split('-')[1]) - 1;
      realData[mesIdx] = m.balance;
    });

    const closedCount = this.balance.meses.length;
    const remaining = 12 - closedCount;

    const mediaData: (number | null)[] = new Array(12).fill(null);
    const minimaData: (number | null)[] = new Array(12).fill(null);
    const maximaData: (number | null)[] = new Array(12).fill(null);

    if (remaining > 0 && closedCount > 0) {
      const perMonth = {
        media: this.balance.prev_media / remaining,
        minima: this.balance.prev_minima / remaining,
        maxima: this.balance.prev_maxima / remaining,
      };
      // Bridge: connect forecast lines from the last real data point
      const bridgeIdx = closedCount - 1;
      mediaData[bridgeIdx] = realData[bridgeIdx];
      minimaData[bridgeIdx] = realData[bridgeIdx];
      maximaData[bridgeIdx] = realData[bridgeIdx];

      for (let i = closedCount; i < 12; i++) {
        mediaData[i] = perMonth.media;
        minimaData[i] = perMonth.minima;
        maximaData[i] = perMonth.maxima;
      }
    }

    this.chartData = {
      labels: this.MESES_LABELS,
      datasets: [
        {
          label: 'Real',
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
}
