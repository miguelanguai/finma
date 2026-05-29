import { ChangeDetectorRef, Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
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
  suma: number;
  real: number | null;
  fijo: number | null;
  estimado: number | null;
  mapeo: MapPeriodoCategoria | null;
  subcategorias: FilaSubdesglose[];
  expandido: boolean;
  editando: boolean;
  fijoEdit: number | null;
  estimadoEdit: number | null;
}

export interface FilaSubdesglose {
  categoria: Categoria;
  suma: number;
  real: number | null;
  fijo: number | null;
  estimado: number | null;
  mapeo: MapPeriodoCategoria | null;
  editando: boolean;
  fijoEdit: number | null;
  estimadoEdit: number | null;
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
    ProgressBarModule,
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
  desgloseGastos: FilaDesglose[] = [];
  desgloseIngresos: FilaDesglose[] = [];
  ref: DynamicDialogRef | null = null;

  mostrandoNuevaCatGastos = false;
  mostrandoNuevaCatIngresos = false;
  categoriaNuevaGastos: Categoria | null = null;
  categoriaNuevaIngresos: Categoria | null = null;

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
      this.recalcularDesglose();
      return;
    }
    const filtro = new MapPeriodoCategoria(null, undefined, undefined, undefined,
      this.periodoSeleccionado, undefined);
    this.mapCatPerService.getMapPeriodoCategoriasFiltered(filtro).subscribe({
      next: (data) => {
        this.mapeosPeriodo = data;
        this.recalcularDesglose();
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
        this.recalcularDesglose();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  private recalcularDesglose() {
    this.desgloseGastos = this.calcularDesglose(true);
    this.desgloseIngresos = this.calcularDesglose(false);
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

  // --- Resumen totales ---

  get gastosTotal(): number {
    return this.movimientos
      .filter(m => (m.monto ?? 0) < 0)
      .reduce((sum, m) => sum + Math.abs(m.monto ?? 0), 0);
  }

  get ingresosTotal(): number {
    return this.movimientos
      .filter(m => (m.monto ?? 0) > 0)
      .reduce((sum, m) => sum + (m.monto ?? 0), 0);
  }

  // --- Desglose por categoría ---

  get hayPeriodo(): boolean {
    return this.periodoSeleccionado !== null;
  }

  get categoriasDisponiblesGastos(): Categoria[] {
    const ids = new Set<number>();
    for (const f of this.desgloseGastos) {
      ids.add(f.categoria.id!);
      for (const s of f.subcategorias) ids.add(s.categoria.id!);
    }
    return this.categorias.filter(c => c.is_gasto && !ids.has(c.id!));
  }

  get categoriasDisponiblesIngresos(): Categoria[] {
    const ids = new Set<number>();
    for (const f of this.desgloseIngresos) {
      ids.add(f.categoria.id!);
      for (const s of f.subcategorias) ids.add(s.categoria.id!);
    }
    return this.categorias.filter(c => !c.is_gasto && !ids.has(c.id!));
  }

  get totalDesgloseGastos(): number {
    return this.desgloseGastos.reduce((sum, f) => sum + f.suma, 0);
  }

  get totalDesgloseGastosFijo(): number {
    return this.desgloseGastos.reduce((sum, f) => sum + (f.fijo ?? 0), 0);
  }

  get totalDesgloseGastosEstimado(): number {
    return this.desgloseGastos.reduce((sum, f) => sum + (f.estimado ?? 0), 0);
  }

  get totalDesgloseIngresos(): number {
    return this.desgloseIngresos.reduce((sum, f) => sum + f.suma, 0);
  }

  get totalDesgloseIngresosFijo(): number {
    return this.desgloseIngresos.reduce((sum, f) => sum + (f.fijo ?? 0), 0);
  }

  get totalDesgloseIngresosEstimado(): number {
    return this.desgloseIngresos.reduce((sum, f) => sum + (f.estimado ?? 0), 0);
  }

  toggleDesglose(fila: FilaDesglose) {
    fila.expandido = !fila.expandido;
  }

  private calcularDesglose(isGasto: boolean): FilaDesglose[] {
    const movsFiltrados = this.movimientos.filter(m =>
      m.categoria && (isGasto ? (m.monto ?? 0) < 0 : (m.monto ?? 0) > 0)
    );
    const mapaFilas = new Map<number, FilaDesglose>();

    for (const mov of movsFiltrados) {
      const cat = mov.categoria!;
      const catPadreId = cat.padre?.id ?? cat.id!;
      const catPadre = cat.padre ?? cat;

      if (!mapaFilas.has(catPadreId)) {
        mapaFilas.set(catPadreId, {
          categoria: catPadre,
          suma: 0,
          real: null,
          fijo: null,
          estimado: null,
          mapeo: null,
          subcategorias: [],
          expandido: false,
          editando: false,
          fijoEdit: null,
          estimadoEdit: null,
        });
      }

      const fila = mapaFilas.get(catPadreId)!;
      const monto = Math.abs(mov.monto ?? 0);
      fila.suma += monto;

      if (cat.padre) {
        let sub = fila.subcategorias.find(s => s.categoria.id === cat.id);
        if (!sub) {
          sub = { categoria: cat, suma: 0, real: null, fijo: null, estimado: null, mapeo: null, editando: false, fijoEdit: null, estimadoEdit: null };
          fila.subcategorias.push(sub);
        }
        sub.suma += monto;
      }
    }

    if (this.periodoSeleccionado && this.mapeosPeriodo.length > 0) {
      for (const mapeo of this.mapeosPeriodo) {
        if (!mapeo.categoria || (mapeo.categoria as any).is_gasto !== isGasto) continue;
        const cat = mapeo.categoria as unknown as Categoria;
        const catPadreId = cat.padre?.id ?? cat.id!;
        if (!mapaFilas.has(catPadreId)) {
          const catPadre = (cat.padre as unknown as Categoria) ?? cat;
          mapaFilas.set(catPadreId, {
            categoria: catPadre, suma: 0, real: null, fijo: null, estimado: null,
            mapeo: null, subcategorias: [], expandido: false,
            editando: false, fijoEdit: null, estimadoEdit: null,
          });
        }
        if (cat.padre) {
          const fila = mapaFilas.get(catPadreId)!;
          if (!fila.subcategorias.find(s => s.categoria.id === cat.id)) {
            fila.subcategorias.push({
              categoria: cat, suma: 0, real: null, fijo: null, estimado: null,
              mapeo: null, editando: false, fijoEdit: null, estimadoEdit: null,
            });
          }
        }
      }
    }

    if (this.periodoSeleccionado && this.mapeosPeriodo.length > 0) {
      const ingFijo = this.periodoSeleccionado.ingreso_fijo ?? 0;
      const ingEst = this.periodoSeleccionado.ingreso_estimado ?? 0;
      const ingReal = this.ingresosTotal;

      for (const fila of mapaFilas.values()) {
        const mapeo = this.mapeosPeriodo.find(m => m.categoria?.id === fila.categoria.id);
        if (mapeo) {
          fila.fijo = mapeo.porc_ideal_fijo != null ? ingFijo * mapeo.porc_ideal_fijo / 100 : null;
          fila.estimado = mapeo.porc_ideal_estimado != null ? ingEst * mapeo.porc_ideal_estimado / 100 : null;
          fila.real = mapeo.porc_ideal_obtenido != null ? ingReal * mapeo.porc_ideal_obtenido / 100 : null;
          fila.mapeo = mapeo;
        }

        for (const sub of fila.subcategorias) {
          const mapeoSub = this.mapeosPeriodo.find(m => m.categoria?.id === sub.categoria.id);
          if (mapeoSub) {
            sub.fijo = mapeoSub.porc_ideal_fijo != null ? ingFijo * mapeoSub.porc_ideal_fijo / 100 : null;
            sub.estimado = mapeoSub.porc_ideal_estimado != null ? ingEst * mapeoSub.porc_ideal_estimado / 100 : null;
            sub.real = mapeoSub.porc_ideal_obtenido != null ? ingReal * mapeoSub.porc_ideal_obtenido / 100 : null;
            sub.mapeo = mapeoSub;
          }
        }
      }
    }

    return Array.from(mapaFilas.values())
      .sort((a, b) => b.suma - a.suma);
  }

  mostrarNuevaCat(isGasto: boolean) {
    if (isGasto) { this.mostrandoNuevaCatGastos = true; this.categoriaNuevaGastos = null; }
    else { this.mostrandoNuevaCatIngresos = true; this.categoriaNuevaIngresos = null; }
  }

  cancelarNuevaCat(isGasto: boolean) {
    if (isGasto) { this.mostrandoNuevaCatGastos = false; this.categoriaNuevaGastos = null; }
    else { this.mostrandoNuevaCatIngresos = false; this.categoriaNuevaIngresos = null; }
  }

  confirmarNuevaCat(isGasto: boolean) {
    const cat = isGasto ? this.categoriaNuevaGastos : this.categoriaNuevaIngresos;
    if (!cat || !this.periodoSeleccionado) return;
    const mapeo = new MapPeriodoCategoria(null, undefined, undefined, undefined,
      this.periodoSeleccionado, cat);
    this.mapCatPerService.saveMapPeriodoCategoria(mapeo).subscribe({
      next: () => {
        if (isGasto) { this.mostrandoNuevaCatGastos = false; this.categoriaNuevaGastos = null; }
        else { this.mostrandoNuevaCatIngresos = false; this.categoriaNuevaIngresos = null; }
        this.getMapeosPeriodo();
      },
      error: (err) => console.error(err),
    });
  }

  iniciarEdicion(fila: FilaDesglose | FilaSubdesglose, event: Event) {
    event.stopPropagation();
    fila.fijoEdit = fila.fijo;
    fila.estimadoEdit = fila.estimado;
    fila.editando = true;
  }

  cancelarEdicion(fila: FilaDesglose | FilaSubdesglose, event: Event) {
    event.stopPropagation();
    fila.editando = false;
  }

  guardarEdicion(fila: FilaDesglose | FilaSubdesglose, event: Event) {
    event.stopPropagation();
    const ingFijo = this.periodoSeleccionado!.ingreso_fijo ?? 0;
    const ingEst = this.periodoSeleccionado!.ingreso_estimado ?? 0;
    const porcFijo = (fila.fijoEdit != null && ingFijo > 0) ? fila.fijoEdit / ingFijo * 100 : null;
    const porcEst = (fila.estimadoEdit != null && ingEst > 0) ? fila.estimadoEdit / ingEst * 100 : null;

    const mapeo = new MapPeriodoCategoria(
      fila.mapeo?.id ?? null,
      porcFijo ?? undefined, porcEst ?? undefined, undefined,
      this.periodoSeleccionado!,
      fila.categoria as Categoria,
    );
    this.mapCatPerService.saveMapPeriodoCategoria(mapeo).subscribe({
      next: () => this.getMapeosPeriodo(),
      error: (err) => console.error(err),
    });
  }

  porcentajeReal(fila: FilaDesglose | FilaSubdesglose): number | null {
    if (fila.estimado == null || fila.estimado === 0) return null;
    return Math.min(fila.suma / fila.estimado * 100, 100);
  }

  estadoReal(fila: FilaDesglose | FilaSubdesglose, isGasto: boolean): string {
    if (fila.estimado == null) return '';
    if (isGasto) {
      if (fila.suma > fila.estimado) return 'estado-exceso';
      if (fila.suma > fila.estimado * 0.85) return 'estado-alerta';
      return 'estado-ok';
    } else {
      if (fila.suma < fila.estimado) return 'estado-exceso';
      if (fila.suma < fila.estimado * 0.85) return 'estado-alerta';
      return 'estado-ok';
    }
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
