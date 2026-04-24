import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MovimientoService, FiltrosMovimiento } from '../movimiento-service';
import { Movimiento } from '../movimiento';
import { MovimientoEdit } from '../movimiento-edit/movimiento-edit';
import { ExcelUpload } from '../excel-upload/excel-upload';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Categoria } from '../../categoria/Categoria';
import { CategoriaService } from '../../categoria/categoria-service';

@Component({
  selector: 'app-movimiento-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DatePickerModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    TableModule,
    ToastModule,
  ],
  providers: [
    ConfirmationService,
    DialogService,
    MessageService,
  ],
  templateUrl: './movimiento-list.html',
  styleUrl: './movimiento-list.css',
})
export class MovimientoList {
  movimientos: Movimiento[] = [];
  categorias: Categoria[] = [];
  ref: DynamicDialogRef | null = null;

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  categoriaSeleccionada: Categoria | null = null;
  tipoSeleccionado: boolean | null = null;
  conceptoBusqueda: string = '';

  tipoOpciones = [
    { label: 'Todos', value: null },
    { label: 'Gasto', value: true },
    { label: 'Ingreso', value: false },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private movimientoService: MovimientoService,
    private categoriaService: CategoriaService,
  ) { }

  ngOnInit() {
    this.getCategorias();
    this.getMovimientos();
  };

  getCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data.map(
          d => new Categoria(d.id, d.nombre, d.is_gasto, d.padre ?? undefined)
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getMovimientos() {
    const filtros = this.buildFiltros();
    this.movimientoService.getMovimientos(filtros).subscribe({
      next: (data) => {
        this.movimientos = data.map(
          d => new Movimiento(d.id, d.concepto, d.monto, d.fecha, d.recurrente, d.notas ?? undefined, d.periodo ?? undefined, d.categoria ?? undefined)
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  aplicarFiltros() {
    this.getMovimientos();
  }

  limpiarFiltros() {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.categoriaSeleccionada = null;
    this.tipoSeleccionado = null;
    this.conceptoBusqueda = '';
    this.getMovimientos();
  }

  private buildFiltros(): FiltrosMovimiento | undefined {
    const hay = this.fechaDesde || this.fechaHasta || this.categoriaSeleccionada || this.tipoSeleccionado != null || this.conceptoBusqueda;
    if (!hay) return undefined;

    const filtros: FiltrosMovimiento = {};
    if (this.fechaDesde) filtros.fecha_desde = this.toISODate(this.fechaDesde);
    if (this.fechaHasta) filtros.fecha_hasta = this.toISODate(this.fechaHasta);
    if (this.categoriaSeleccionada) filtros.categoria_id = this.categoriaSeleccionada.id;
    if (this.tipoSeleccionado != null) filtros.is_gasto = this.tipoSeleccionado;
    if (this.conceptoBusqueda) filtros.concepto = this.conceptoBusqueda;
    return filtros;
  }

  private toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  showCreateMovimientoDialog(movimiento?: Movimiento) {
    this.ref = this.dialogService.open(MovimientoEdit, {
      data: {
        movimiento: movimiento ?? null,
      },
      header: movimiento ? 'Editar Movimiento' : 'Crear Movimiento',
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    })

    this.ref?.onClose.subscribe((returnedMovimiento: Movimiento) => {
      if (returnedMovimiento) {
        this.movimientoService.saveMovimiento(returnedMovimiento).subscribe({
          next: () => {
            this.getMovimientos();
            if (movimiento) {
              this.messageService.add({ severity: "info", summary: "Confirmado", detail: "Has editado el movimiento" });
            } else {
              this.messageService.add({ severity: "info", summary: "Confirmado", detail: "Has creado el movimiento" });
            }
          },
          error: err => console.error("Error al guardar el movimiento", err),
        });
      }
    });
  }

  showExcelUploadDialog() {
    this.ref = this.dialogService.open(ExcelUpload, {
      header: 'Importar movimientos desde Excel',
      closeOnEscape: true,
      closable: true,
      resizable: false,
      draggable: true,
    });

    this.ref?.onClose.subscribe((resultado: boolean) => {
      if (resultado) {
        this.getMovimientos();
        this.messageService.add({ severity: 'success', summary: 'Importado', detail: 'Los movimientos se han importado correctamente' });
      }
    });
  }

  showDeleteMovimientoDialog(movimiento: Movimiento, event: Event) {
    this.confirmationService.confirm({
      header: "¿Borrar movimiento?",
      message: "Confirma para continuar",
      accept: () => {
        this.movimientoService.deleteMovimiento(movimiento).subscribe({
          next: () => {
            this.getMovimientos();
            this.messageService.add({ severity: "info", summary: "Confirmado", detail: "Has eliminado el movimiento" });
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: "info", summary: "Rechazado", detail: "El movimiento sigue existiendo" });
      }
    });
  }
}
