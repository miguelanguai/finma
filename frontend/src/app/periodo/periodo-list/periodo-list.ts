import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Periodo } from '../periodo';
import { PeriodoCreate } from '../periodo-create/periodo-create';
import { PeriodoService } from '../periodo-service';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-periodo-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    ToastModule
  ],
  providers: [
    DialogService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './periodo-list.html',
  styleUrl: './periodo-list.css',
})
export class PeriodoList implements OnInit {

  periodos: Periodo[] = [];

  ref: DynamicDialogRef | null = null;

  constructor(private cdr: ChangeDetectorRef, private confirmationService: ConfirmationService, public dialogService: DialogService, private messageService: MessageService, private periodoService: PeriodoService) { }

  ngOnInit() {
    this.getPeriodos();

  }

  getPeriodos() {
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

  showCreatePeriodoDialog(periodo?: Periodo) {
    this.ref = this.dialogService.open(PeriodoCreate, {
      data: {
        periodo: periodo ?? null
      },
      header: "select",
      closeOnEscape: true,
      closable: true,
      resizable: true,
      draggable: true,
    })

    this.ref?.onClose.subscribe((periodo: Periodo) => {
      if (periodo) {
        this.periodoService.savePeriodo(periodo).subscribe({
          next: () => {
            this.ngOnInit();
          },
          error: err => {
            console.error("Error al guardar el periodo", err);
          }
        });
      }
    });
  }

  showDeletePeriodoDialog(periodo: Periodo, event: Event) {
    this.confirmationService.confirm({
      header: "¿Borrar periodo?",
      message: "Confirma para continuar",
      accept: () => {
        this.periodoService.deletePeriodo(periodo).subscribe({
          next: (data) => {
          }
        })
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Has eliminado el periodo"
        });
        this.ngOnInit();
        this.getPeriodos();
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rechazado",
          detail: "El periodo sigue existiendo"
        })
      }
    })
  }

}
