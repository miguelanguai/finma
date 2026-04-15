import { Component } from '@angular/core';

import { ObjetivoAnalisis } from '../objetivo-analisis/objetivo-analisis';
import { CategoriaAnalisis } from '../categoria-analisis/categoria-analisis';
import { BalanceAnalisis } from '../balance-analisis/balance-analisis';

@Component({
  selector: 'app-analisis',
  imports: [ObjetivoAnalisis, CategoriaAnalisis, BalanceAnalisis],
  templateUrl: './analisis.html',
  styleUrl: './analisis.css',
})
export class Analisis {}
