import { Component, OnInit } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';

import { AnalisisService } from '../analisis-service';
import { ProgresoObjetivoResponse, GastoCategoriaResponse, BalanceAnualResponse } from '../analisis-response';
import { ObjetivoAnalisis } from '../objetivo-analisis/objetivo-analisis';
import { CategoriaAnalisis } from '../categoria-analisis/categoria-analisis';
import { BalanceAnalisis } from '../balance-analisis/balance-analisis';

interface Kpi {
  label: string;
  valor: string;
  positivo?: boolean | null;
}

@Component({
  selector: 'app-analisis',
  imports: [
    ObjetivoAnalisis, CategoriaAnalisis, BalanceAnalisis,
    ButtonModule, DecimalPipe, FormsModule, InputNumberModule, NgClass, SkeletonModule,
  ],
  templateUrl: './analisis.html',
  styleUrl: './analisis.css',
})
export class Analisis implements OnInit {
  anio: number = new Date().getFullYear();

  objetivos: ProgresoObjetivoResponse[] | null = null;
  categorias: GastoCategoriaResponse[] | null = null;
  balance: BalanceAnualResponse | null = null;

  cargando = false;
  error = false;

  kpis: Kpi[] = [];

  constructor(private analisisService: AnalisisService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = false;

    forkJoin({
      objetivos: this.analisisService.getProgresoObjetivos(),
      categorias: this.analisisService.getGastosCategorias(this.anio),
      balance: this.analisisService.getBalance(this.anio),
    }).subscribe({
      next: ({ objetivos, categorias, balance }) => {
        this.objetivos = objetivos;
        this.categorias = categorias;
        this.balance = balance;
        this.computarKpis();
        this.cargando = false;
      },
      error: () => {
        this.error = true;
        this.cargando = false;
      },
    });
  }

  private computarKpis(): void {
    if (!this.balance || !this.categorias || !this.objetivos) return;

    const balanceActual = this.balance.balance_actual;

    let totalGastado = 0;
    const gastosPorMes: Record<string, number> = {};
    for (const cat of this.categorias) {
      for (const [mes, valor] of Object.entries(cat.gastos_por_mes)) {
        totalGastado += valor;
        gastosPorMes[mes] = (gastosPorMes[mes] ?? 0) + valor;
      }
    }

    const pendientes = this.objetivos
      .filter(o => o.porcentaje < 100)
      .sort((a, b) => b.porcentaje - a.porcentaje);
    const masCercano = pendientes[0] ?? null;

    const mesMayorGasto = Object.entries(gastosPorMes)
      .sort((a, b) => b[1] - a[1])[0] ?? null;

    this.kpis = [
      {
        label: 'Balance del año',
        valor: `${balanceActual >= 0 ? '+' : ''}${balanceActual.toFixed(2)} €`,
        positivo: balanceActual >= 0,
      },
      {
        label: 'Total gastado',
        valor: `${totalGastado.toFixed(2)} €`,
        positivo: null,
      },
      {
        label: 'Objetivo más próximo',
        valor: masCercano
          ? `${masCercano.nombre} (${masCercano.porcentaje.toFixed(0)}%)`
          : '—',
        positivo: null,
      },
      {
        label: 'Mes con mayor gasto',
        valor: mesMayorGasto
          ? `${mesMayorGasto[0]}  —  ${parseFloat(mesMayorGasto[1].toFixed(2)).toLocaleString('es-ES')} €`
          : '—',
        positivo: null,
      },
    ];
  }
}
