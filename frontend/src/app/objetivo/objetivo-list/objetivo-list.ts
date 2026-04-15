import { ChangeDetectorRef, Component } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { Objetivo } from '../Objetivo';
import { ObjetivoService } from '../objetivo-service';
import { ObjetivoEdit } from '../objetivo-edit/objetivo-edit';

@Component({
  selector: 'app-objetivo-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    DatePipe,
    DecimalPipe,
    FormsModule,
    SelectButtonModule,
    TableModule,
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

  filtroCumplido: string = 'pendientes';
  filtroOpciones = [
    { label: 'Pendientes', value: 'pendientes' },
    { label: 'Cumplidos', value: 'cumplidos' },
    { label: 'Todos', value: 'todos' },
  ];

  get objetivosFiltrados(): Objetivo[] {
    if (this.filtroCumplido === 'pendientes') {
      return this.objetivos.filter(o => !o.is_cumplido);
    }
    if (this.filtroCumplido === 'cumplidos') {
      return this.objetivos.filter(o => o.is_cumplido);
    }
    return this.objetivos;
  }

  ref: DynamicDialogRef | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private objetivoService: ObjetivoService,
  ) { }

  ngOnInit() {
    this.getObjetivos();
  }

  getObjetivos(): void {
    this.objetivoService.getObjetivos().subscribe({
      next: (data) => {
        this.objetivos = data.map(
          d => new Objetivo(d.id, d.nombre, d.monto, d.prioridad, d.fecha, d.is_cumplido)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

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
          error: (err) => {
            console.error('Error al guardar el objetivo', err);
          }
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
          error: (err) => {
            console.error('Error al eliminar el objetivo', err);
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Rechazado',
          detail: 'El objetivo sigue existiendo',
        });
      }
    });
  }
}
