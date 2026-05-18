import { ChangeDetectorRef, Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
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
import { Periodo } from '../../periodo/periodo';
import { PeriodoService } from '../../periodo/periodo-service';
import { MapPeriodoCategoria } from '../../periodo/MapPeriodoCategoria';
import { MapCatPerService } from '../../periodo/map-cat-per-service';

export interface FilaDesglose {
  categoria: Categoria;
  real: number;
  fijo: number | null;
  estimado: number | null;
  subcategorias: FilaSubdesglose[];
  expandido: boolean;
}

export interface FilaSubdesglose {
  categoria: Categoria;
  real: number;
  fijo: number | null;
  estimado: number | null;
}

@Component({
  selector: 'app-movimiento-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DatePickerModule,
    DecimalPipe,
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
  movimientosSeleccionados: Movimiento[] = [];
  categorias: Categoria[] = [];
  periodos: Periodo[] = [];
  mapeosPeriodo: MapPeriodoCategoria[] = [];
  ref: DynamicDialogRef | null = null;

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  categoriaSeleccionada: Categoria | null = null;
  periodoSeleccionado: Periodo | null = null;
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
    private periodoService: PeriodoService,
    private mapCatPerService: MapCatPerService,
  ) { }

  ngOnInit() {
    this.getCategorias();
    this.getPeriodos();
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

  getPeriodos() {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {
        this.periodos = data.map(
          d => new Periodo(d.id, d.nombre, d.fecha, d.ingreso_fijo, d.ingreso_estimado)
        ).sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getMapeosPeriodo() {
    if (!this.periodoSeleccionado) {
      this.mapeosPeriodo = [];
      return;
    }
    const filtro = new MapPeriodoCategoria(null, undefined, undefined, undefined,
      this.periodoSeleccionado, undefined);
    this.mapCatPerService.getMapPeriodoCategoriasFiltered(filtro).subscribe({
      next: (data) => {
        this.mapeosPeriodo = data;
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
    this.getMapeosPeriodo();
    this.getMovimientos();
  }

  limpiarFiltros() {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.categoriaSeleccionada = null;
    this.periodoSeleccionado = null;
    this.tipoSeleccionado = null;
    this.conceptoBusqueda = '';
    this.mapeosPeriodo = [];
    this.getMovimientos();
  }

  private buildFiltros(): FiltrosMovimiento | undefined {
    const hay = this.fechaDesde || this.fechaHasta || this.categoriaSeleccionada
      || this.tipoSeleccionado != null || this.conceptoBusqueda || this.periodoSeleccionado;
    if (!hay) return undefined;

    const filtros: FiltrosMovimiento = {};
    if (this.fechaDesde) filtros.fecha_desde = this.toISODate(this.fechaDesde);
    if (this.fechaHasta) filtros.fecha_hasta = this.toISODate(this.fechaHasta);
    if (this.categoriaSeleccionada) filtros.categoria_id = this.categoriaSeleccionada.id;
    if (this.tipoSeleccionado != null) filtros.is_gasto = this.tipoSeleccionado;
    if (this.conceptoBusqueda) filtros.concepto = this.conceptoBusqueda;
    if (this.periodoSeleccionado) filtros.periodo_id = this.periodoSeleccionado.id;
    return filtros;
  }

  // --- Resumen totales (existente) ---

  get gastosCategorizados(): number {
    return this.movimientos
      .filter(m => m.categoria && m.categoria.is_gasto === true)
      .reduce((sum, m) => sum + Math.abs(m.monto ?? 0), 0);
  }

  get gastosSinCategorizar(): number {
    return this.movimientos
      .filter(m => !m.categoria)
      .reduce((sum, m) => {
        const v = m.monto ?? 0;
        return sum + (v < 0 ? Math.abs(v) : 0);
      }, 0);
  }

  get gastosTotal(): number {
    return this.gastosCategorizados + this.gastosSinCategorizar;
  }

  get ingresosCategorizados(): number {
    return this.movimientos
      .filter(m => m.categoria && m.categoria.is_gasto === false)
      .reduce((sum, m) => sum + Math.abs(m.monto ?? 0), 0);
  }

  get ingresosSinCategorizar(): number {
    return this.movimientos
      .filter(m => !m.categoria)
      .reduce((sum, m) => {
        const v = m.monto ?? 0;
        return sum + (v > 0 ? v : 0);
      }, 0);
  }

  get ingresosTotal(): number {
    return this.ingresosCategorizados + this.ingresosSinCategorizar;
  }

  // --- Desglose por categoría ---

  get hayPeriodo(): boolean {
    return this.periodoSeleccionado !== null;
  }

  get desgloseGastos(): FilaDesglose[] {
    return this.calcularDesglose(true);
  }

  get desgloseIngresos(): FilaDesglose[] {
    return this.calcularDesglose(false);
  }

  toggleDesglose(fila: FilaDesglose) {
    fila.expandido = !fila.expandido;
  }

  private calcularDesglose(isGasto: boolean): FilaDesglose[] {
    const movsFiltrados = this.movimientos.filter(m => m.categoria && m.categoria.is_gasto === isGasto);
    const mapaFilas = new Map<number, FilaDesglose>();

    for (const mov of movsFiltrados) {
      const cat = mov.categoria!;
      const catPadreId = cat.padre?.id ?? cat.id!;
      const catPadre = cat.padre ?? cat;

      if (!mapaFilas.has(catPadreId)) {
        mapaFilas.set(catPadreId, {
          categoria: catPadre,
          real: 0,
          fijo: null,
          estimado: null,
          subcategorias: [],
          expandido: false,
        });
      }

      const fila = mapaFilas.get(catPadreId)!;
      const monto = Math.abs(mov.monto ?? 0);
      fila.real += monto;

      if (cat.padre) {
        let sub = fila.subcategorias.find(s => s.categoria.id === cat.id);
        if (!sub) {
          sub = { categoria: cat, real: 0, fijo: null, estimado: null };
          fila.subcategorias.push(sub);
        }
        sub.real += monto;
      }
    }

    if (this.periodoSeleccionado && this.mapeosPeriodo.length > 0) {
      const ingFijo = this.periodoSeleccionado.ingreso_fijo ?? 0;
      const ingEst = this.periodoSeleccionado.ingreso_estimado ?? 0;

      for (const fila of mapaFilas.values()) {
        const mapeo = this.mapeosPeriodo.find(m => m.categoria?.id === fila.categoria.id);
        if (mapeo) {
          fila.fijo = mapeo.porc_ideal_fijo != null ? ingFijo * mapeo.porc_ideal_fijo / 100 : null;
          fila.estimado = mapeo.porc_ideal_estimado != null ? ingEst * mapeo.porc_ideal_estimado / 100 : null;
        }

        for (const sub of fila.subcategorias) {
          const mapeoSub = this.mapeosPeriodo.find(m => m.categoria?.id === sub.categoria.id);
          if (mapeoSub) {
            sub.fijo = mapeoSub.porc_ideal_fijo != null ? ingFijo * mapeoSub.porc_ideal_fijo / 100 : null;
            sub.estimado = mapeoSub.porc_ideal_estimado != null ? ingEst * mapeoSub.porc_ideal_estimado / 100 : null;
          }
        }
      }
    }

    return Array.from(mapaFilas.values())
      .sort((a, b) => b.real - a.real);
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

  exportarExcel() {
    const filtros = this.buildFiltros();
    this.movimientoService.exportarMovimientos(filtros).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `movimientos_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al exportar', err),
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
