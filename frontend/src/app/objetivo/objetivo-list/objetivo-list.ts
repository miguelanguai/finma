import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { Objetivo } from '../Objetivo';
import { MapCategoriaObjetivo } from '../MapCategoriaObjetivo';
import { ObjetivoService } from '../objetivo-service';
import { ObjetivoEdit } from '../objetivo-edit/objetivo-edit';
import { ObjetivoMapeoEdit } from '../mapeo-edit/mapeo-edit';
import { Categoria } from '../../categoria/Categoria';
import { CategoriaService } from '../../categoria/categoria-service';

@Component({
  selector: 'app-objetivo-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DatePipe,
    DecimalPipe,
    FormsModule,
    SelectButtonModule,
    SelectModule,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService,
  ],
  templateUrl: './objetivo-list.html',
  styleUrl: './objetivo-list.css',
})
export class ObjetivoList {
  objetivos: Objetivo[] = [];
  mapeos: MapCategoriaObjetivo[] = [];
  categorias: Categoria[] = [];

  filtroCumplido: string = 'pendientes';
  filtroOpciones = [
    { label: 'Pendientes', value: 'pendientes' },
    { label: 'Cumplidos', value: 'cumplidos' },
    { label: 'Todos', value: 'todos' },
  ];

  selectedObjetivoFiltro: Objetivo | null = null;

  get objetivosFiltrados(): Objetivo[] {
    if (this.filtroCumplido === 'pendientes') {
      return this.objetivos.filter(o => !o.is_cumplido);
    }
    if (this.filtroCumplido === 'cumplidos') {
      return this.objetivos.filter(o => o.is_cumplido);
    }
    return this.objetivos;
  }

  get mapeosFiltrados(): MapCategoriaObjetivo[] {
    if (!this.selectedObjetivoFiltro) return this.mapeos;
    return this.mapeos.filter(m => m.objetivo?.id === this.selectedObjetivoFiltro!.id);
  }

  ref: DynamicDialogRef | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private categoriaService: CategoriaService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private objetivoService: ObjetivoService,
  ) { }

  ngOnInit() {
    this.getObjetivos();
    this.getMapeos();
    this.getCategorias();
  }

  getObjetivos(): void {
    this.objetivoService.getObjetivos().subscribe({
      next: (data) => {
        this.objetivos = data.map(
          d => new Objetivo(d.id, d.nombre, d.monto, d.prioridad, d.fecha, d.is_cumplido)
        );
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getMapeos(): void {
    this.objetivoService.getMapeos().subscribe({
      next: (data) => {
        this.mapeos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  getCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => console.error(err),
    });
  }

  // --- Objetivo CRUD ---

  showObjetivoDialog(objetivo?: Objetivo) {
    this.ref = this.dialogService.open(ObjetivoEdit, {
      data: { objetivo: objetivo ?? null },
      header: objetivo ? 'Editar Objetivo' : 'Crear Objetivo',
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    });

    this.ref?.onClose.subscribe((returnedObjetivo: Objetivo) => {
      if (returnedObjetivo) {
        const operacion$ = returnedObjetivo.id
          ? this.objetivoService.updateObjetivo(returnedObjetivo.id, returnedObjetivo)
          : this.objetivoService.createObjetivo(returnedObjetivo);

        operacion$.subscribe({
          next: () => {
            this.getObjetivos();
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: objetivo ? 'Has editado el objetivo' : 'Has creado el objetivo',
            });
          },
          error: (err) => console.error('Error al guardar el objetivo', err),
        });
      }
    });
  }

  showDeleteObjetivoDialog(objetivo: Objetivo) {
    this.confirmationService.confirm({
      header: '¿Borrar objetivo?',
      message: 'Confirma para continuar',
      accept: () => {
        this.objetivoService.deleteObjetivo(objetivo.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: 'Has eliminado el objetivo',
            });
            this.getObjetivos();
          },
          error: (err) => console.error('Error al eliminar el objetivo', err),
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'El objetivo sigue existiendo',
        });
      },
    });
  }

  // --- Mapeo CRUD ---

  showMapeoDialog(mapeo?: MapCategoriaObjetivo) {
    this.ref = this.dialogService.open(ObjetivoMapeoEdit, {
      data: {
        mapeo: mapeo ?? null,
        objetivo: this.selectedObjetivoFiltro ?? null,
        categoriaList: this.categorias,
        objetivoList: this.objetivos,
      },
      header: mapeo ? 'Editar Mapeo' : 'Crear Mapeo',
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    });

    this.ref?.onClose.subscribe((returnedMapeos: MapCategoriaObjetivo[]) => {
      if (!returnedMapeos?.length) return;

      const requests = returnedMapeos.map(m =>
        m.id
          ? this.objetivoService.updateMapeo(m.id, m)
          : this.objetivoService.createMapeo(m)
      );

      let completed = 0;
      requests.forEach(req$ => {
        req$.subscribe({
          next: () => {
            completed++;
            if (completed === requests.length) {
              this.getMapeos();
              this.messageService.add({
                severity: 'info',
                summary: 'Confirmado',
                detail: mapeo ? 'Has editado el mapeo' : `Has creado ${requests.length} mapeo(s)`,
              });
            }
          },
          error: (err) => console.error('Error al guardar el mapeo', err),
        });
      });
    });
  }

  showDeleteMapeoDialog(mapeo: MapCategoriaObjetivo) {
    this.confirmationService.confirm({
      header: '¿Borrar mapeo?',
      message: 'Confirma para continuar',
      accept: () => {
        this.objetivoService.deleteMapeo(mapeo.id!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Confirmado',
              detail: 'Has eliminado el mapeo',
            });
            this.getMapeos();
          },
          error: (err) => console.error('Error al eliminar el mapeo', err),
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'El mapeo sigue existiendo',
        });
      },
    });
  }
}
