import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { Movimiento } from '../movimiento';
import { Categoria } from '../../categoria/Categoria';
import { Periodo } from '../../periodo/periodo';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PeriodoService } from '../../periodo/periodo-service';
import { CategoriaService } from '../../categoria/categoria-service';

@Component({
  selector: 'app-movimiento-edit',
  imports: [
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
    ToggleSwitchModule

  ],
  templateUrl: './movimiento-edit.html',
  styleUrl: './movimiento-edit.css',
})
export class MovimientoEdit {
  movimiento: Movimiento = new Movimiento();
  categoriaList: Categoria[] = [];
  periodoList: Periodo[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private periodoService: PeriodoService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (this.config.data?.movimiento) {
      this.movimiento = this.config.data?.movimiento;
    }
    this.getPeriodos();
    this.getCategorias();
  }

  createMovimiento() {
    if (this.movimiento.recurrente == undefined) {
      this.movimiento.recurrente = false;
    }
    if (this.movimiento.monto != null) {
      this.movimiento.monto = Number(this.movimiento.monto);
    }
    if (this.movimiento.notas == ""){
      this.movimiento.notas = null;
    }
    this.ref.close(this.movimiento);
  }

  getPeriodos() {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {

        this.periodoList = data.map(
          d => new Periodo(d.id, d.nombre, d.fecha, d.ingreso_fijo, d.ingreso_estimado)
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {

        this.categoriaList = data.map(
          d => new Categoria(d.id, d.nombre, d.is_gasto, d.padre ?? undefined)
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
