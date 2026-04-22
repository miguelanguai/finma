import { Component, Input, OnChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-balance-general',
  imports: [DecimalPipe, ProgressBarModule],
  templateUrl: './balance-general.html',
  styleUrl: './balance-general.css',
})
export class BalanceGeneral implements OnChanges {
  @Input() gasto: number = 0;
  @Input() ingreso: number = 0;
  @Input() balance: number = 0;

  pctGasto: number = 0;
  pctAhorro: number = 0;
  estadoGasto: 'ok' | 'alerta' | 'critico' = 'ok';

  ngOnChanges(): void {
    if (this.ingreso > 0) {
      this.pctGasto = Math.min(Math.round((this.gasto / this.ingreso) * 100), 100);
      this.pctAhorro = Math.max(Math.round((this.balance / this.ingreso) * 100), 0);
    } else {
      this.pctGasto = 0;
      this.pctAhorro = 0;
    }

    if (this.pctGasto >= 100) this.estadoGasto = 'critico';
    else if (this.pctGasto >= 80) this.estadoGasto = 'alerta';
    else this.estadoGasto = 'ok';
  }
}
