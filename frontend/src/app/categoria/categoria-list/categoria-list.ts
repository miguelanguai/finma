import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { Categoria } from '../Categoria';
import { CategoriaService } from '../categoria-service';
import { CategoriaEdit } from '../categoria-edit/categoria-edit';
import { MapCatPerService } from '../../periodo/map-cat-per-service';
import { MapPeriodoCategoria } from '../../periodo/MapPeriodoCategoria';
import { Periodo } from '../../periodo/periodo';
import { PeriodoService } from '../../periodo/periodo-service';

@Component({
  selector: 'app-categoria-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ChipModule,
    FormsModule,
    ListboxModule,
    TableModule,
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

  ref: DynamicDialogRef | null = null;

  constructor(private cdr: ChangeDetectorRef, private confirmationService: ConfirmationService, public dialogService: DialogService, private messageService: MessageService, private categoriaService: CategoriaService, private mapService: MapCatPerService, private periodoService: PeriodoService) { }

  ngOnInit() {
    this.getCategorias();
    this.getPeriodos();
    //TODO: Listar también el gasto total (real) que supone la categoria al mes. Es decir, la suma de todos los movimientos pertenecientes a la categoria
    //TODO: Poner formularios para creación y edición de mapeos


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
          d => new MapPeriodoCategoria(d.id, d.porc_ideal_fijo ?? undefined, d.porc_ideal_estimado ?? undefined, d.porc_ideal_obtenido ?? undefined, d.periodo ?? undefined, d.categoria ?? undefined)
        );
        this.cdr.detectChanges();
        this.checkAllMapsAreAssigned();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getPeriodos(): void {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {
        this.periodos = data.map(
          d => new Periodo(d.id, d.nombre, d.fecha)
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
      header: "select",
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    })

    this.ref?.onClose.subscribe((returnedCategoria: Categoria) => {
      if (returnedCategoria) {
        this.categoriaService.saveCategoria(returnedCategoria).subscribe({
          next: () => {
            this.ngOnInit();
            if (categoria) {

              this.messageService.add({
                severity: "info",
                summary: "Confirmado",
                detail: "Has editado la categoria"
              });
            } else {
              this.messageService.add({
                severity: "info",
                summary: "Confirmado",
                detail: "Has creado la categoria"
              });
            }
          },
          error: err => {
            console.error("Error al guardar el categoria", err);
          }
        });
      }
    });
  }

  showDeleteCategoriaDialog(categoria: Categoria, event: Event) {
    this.confirmationService.confirm({
      header: "¿Borrar categoria?",
      message: "Confirma para continuar",
      accept: () => {
        this.categoriaService.deleteCategoria(categoria).subscribe({
          next: (data) => {
          }
        })
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Has eliminado la categoria"
        });
        this.ngOnInit();
        this.getCategorias();
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rechazado",
          detail: "La categoria sigue existiendo"
        })
      }
    })
  }
}
