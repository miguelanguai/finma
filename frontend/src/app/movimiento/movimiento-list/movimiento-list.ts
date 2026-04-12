import { ChangeDetectorRef, Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MovimientoService } from '../movimiento-service';
import { Movimiento } from '../movimiento';
import { MovimientoEdit } from '../movimiento-edit/movimiento-edit';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-movimiento-list',
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    TableModule,
    ToastModule
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


  ref: DynamicDialogRef | null = null;

  constructor(private cdr: ChangeDetectorRef, private confirmationService: ConfirmationService, public dialogService: DialogService, private messageService: MessageService, private movimientoService: MovimientoService) { }

  ngOnInit() {
    this.getMovimientos();

  };

  getMovimientos() {
    this.movimientoService.getMovimientos().subscribe({
      next: (data) => {
        //console.log(data);

        this.movimientos = data.map(
          d => new Movimiento(d.id, d.concepto, d.monto, d.fecha, d.recurrente, d.notas?? undefined, d.periodo ?? undefined, d.categoria ?? undefined)
        );

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });

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
            this.ngOnInit();
            if (movimiento) {

              this.messageService.add({
                severity: "info",
                summary: "Confirmado",
                detail: "Has editado el movimiento"
              });
            } else {
              this.messageService.add({
                severity: "info",
                summary: "Confirmado",
                detail: "Has creado el movimiento"
              });
            }
          },
          error: err => {
            console.error("Error al guardar el movimiento", err);
          }
        });
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
            this.messageService.add({
              severity: "info",
              summary: "Confirmado",
              detail: "Has eliminado el movimiento"
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rechazado",
          detail: "El movimiento sigue existiendo"
        })
      }
    })
  }
}
