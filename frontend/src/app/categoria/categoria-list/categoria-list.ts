import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { Categoria } from '../Categoria';
import { CategoriaService } from '../categoria-service';
import { CategoriaEdit } from '../categoria-edit/categoria-edit';
import { MapCatPerService } from '../../periodo/map-cat-per-service';
import { MapPeriodoCategoria } from '../../periodo/MapPeriodoCategoria';
import { Periodo } from '../../periodo/periodo';
import { PeriodoService } from '../../periodo/periodo-service';
import { MapeoEdit } from '../mapeo-edit/mapeo-edit';

@Component({
  selector: 'app-categoria-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ChipModule,
    FormsModule,
    ListboxModule,
    TableModule,
    TabsModule,
    ToastModule
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.css',
})
export class CategoriaList {
  categorias: Categoria[] = [];
  maps: MapPeriodoCategoria[] = [];
  periodos: Periodo[] = [];

  selectedPeriodo: Periodo = new Periodo();
  filterMap: MapPeriodoCategoria = new MapPeriodoCategoria();

  isAllCategoriasAssigned: boolean = false;
  gastosTotales: Record<number, number> = {};

  ref: DynamicDialogRef | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private categoriaService: CategoriaService,
    private mapService: MapCatPerService,
    private periodoService: PeriodoService
  ) { }

  ngOnInit() {
    this.getCategorias();
    this.getPeriodos();
  }

  checkAllMapsAreAssigned(): void {
    this.isAllCategoriasAssigned = this.maps.every(mapeo => {
      return mapeo?.porc_ideal_fijo != null
        && mapeo?.porc_ideal_estimado != null
        && mapeo?.porc_ideal_obtenido != null;
    });
  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data.map(
          d => new Categoria(d.id, d.nombre, d.is_gasto, d.padre ?? undefined)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.getMaps();
  }

  getMaps(): void {
    this.filterMap.periodo = this.selectedPeriodo;
    this.mapService.getMapPeriodoCategoriasFiltered(this.filterMap).subscribe({
      next: (data) => {
        this.maps = data.map(
          d => new MapPeriodoCategoria(
            d.id,
            d.porc_ideal_fijo ?? undefined,
            d.porc_ideal_estimado ?? undefined,
            d.porc_ideal_obtenido ?? undefined,
            d.periodo ?? undefined,
            d.categoria ?? undefined
          )
        );
        this.cdr.detectChanges();
        this.checkAllMapsAreAssigned();
        this.loadGastosTotales();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private loadGastosTotales(): void {
    this.gastosTotales = {};
    this.maps.forEach(map => {
      if (map.id != null) {
        this.mapService.getMapGastoTotal(map).subscribe({
          next: (data) => {
            this.gastosTotales[map.id!] = data.sum;
            this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  getGastoTotal(map: MapPeriodoCategoria): number | null {
    return map.id != null ? (this.gastosTotales[map.id] ?? null) : null;
  }

  getPeriodos(): void {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {
        this.periodos = data.map(
          d => new Periodo(d.id, d.nombre, d.fecha, d.ingreso_fijo, d.ingreso_estimado)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  showCreateCategoriaDialog(categoria?: Categoria) {
    this.ref = this.dialogService.open(CategoriaEdit, {
      data: {
        categoria: categoria ?? null,
        categoriaList: this.categorias
      },
      header: categoria ? 'Editar categoría' : 'Nueva categoría',
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    });

    this.ref?.onClose.subscribe((returnedCategoria: Categoria) => {
      if (returnedCategoria) {
        this.categoriaService.saveCategoria(returnedCategoria).subscribe({
          next: () => {
            this.ngOnInit();
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: categoria ? 'Has editado la categoría' : 'Has creado la categoría'
            });
          },
          error: err => {
            console.error('Error al guardar la categoría', err);
          }
        });
      }
    });
  }

  showDeleteCategoriaDialog(categoria: Categoria, event: Event) {
    this.confirmationService.confirm({
      header: '¿Borrar categoría?',
      message: 'Confirma para continuar',
      accept: () => {
        this.categoriaService.deleteCategoria(categoria).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: 'Has eliminado la categoría'
            });
            this.ngOnInit(); // already calls getCategorias() internally
          },
          error: (err) => {
            console.error('Error al eliminar la categoría', err);
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'La categoría sigue existiendo'
        });
      }
    });
  }

  showCreateMapeoDialog(mapeo?: MapPeriodoCategoria) {
    this.ref = this.dialogService.open(MapeoEdit, {
      data: {
        mapeo: mapeo ?? null,
        mapeoList: this.maps,
        categoriaList: this.categorias,
        periodoList: this.periodos
      },
      header: mapeo ? 'Editar mapeo' : 'Nuevo mapeo',
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    });

    this.ref?.onClose.subscribe((returnedMapeo: MapPeriodoCategoria) => {
      if (returnedMapeo) {
        this.mapService.saveMapPeriodoCategoria(returnedMapeo).subscribe({
          next: () => {
            this.ngOnInit();
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: mapeo ? 'Has editado el mapeo' : 'Has creado el mapeo'
            });
          },
          error: err => {
            console.error('Error al guardar el mapeo', err);
          }
        });
      }
    });
  }

  showDeleteMapeoDialog(mapeo: MapPeriodoCategoria, event: Event) {
    this.confirmationService.confirm({
      header: '¿Borrar mapeo?',
      message: 'Confirma para continuar',
      accept: () => {
        this.mapService.deleteMapPeriodoCategoria(mapeo).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: 'Has eliminado el mapeo'
            });
            this.ngOnInit(); // already calls getCategorias() internally
          },
          error: (err) => {
            console.error('Error al eliminar el mapeo', err);
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'El mapeo sigue existiendo'
        });
      }
    });
  }

}