import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

interface KpiItem {
  label: string;
  valor: string;
  positivo?: boolean | null;
}

@Component({
  selector: 'app-kpi-landing',
  imports: [NgClass],
  templateUrl: './kpi-landing.html',
  styleUrl: './kpi-landing.css',
})
export class KpiLanding {
  @Input() balance: number = 0;
  @Input() gasto: number = 0;
  @Input() ingreso: number = 0;
  @Input() numMovimientos: number = 0;

  get kpis(): KpiItem[] {
    return [
      {
        label: 'Balance',
        valor: `${this.balance >= 0 ? '+' : ''}${this.balance.toFixed(2)} €`,
        positivo: this.balance >= 0,
      },
      {
        label: 'Total gastado',
        valor: `${this.gasto.toFixed(2)} €`,
        positivo: null,
      },
      {
        label: 'Total ingresado',
        valor: `${this.ingreso.toFixed(2)} €`,
        positivo: null,
      },
      {
        label: 'Movimientos',
        valor: `${this.numMovimientos}`,
        positivo: null,
      },
    ];
  }
}
