import { Component, Input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';

import { UltimoMovimientoResponse } from '../../analisis/analisis-response';

@Component({
  selector: 'app-ultimos-movimientos',
  imports: [DatePipe, NgClass, RouterLink, TableModule],
  templateUrl: './ultimos-movimientos.html',
  styleUrl: './ultimos-movimientos.css',
})
export class UltimosMovimientos {
  @Input() movimientos: UltimoMovimientoResponse[] = [];
}
