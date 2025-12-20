import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Periodo } from '../periodo';
import { PeriodoCreate } from '../periodo-create/periodo-create';
import { PeriodoService } from '../periodo-service';

import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-periodo-list',
  imports: [
    ButtonModule,
    TableModule
  ],
  providers: [
    DialogService
  ],
  templateUrl: './periodo-list.html',
  styleUrl: './periodo-list.css',
})
export class PeriodoList implements OnInit {

  periodos: Periodo[] = [];

  ref: DynamicDialogRef | null = null;

  constructor(private cdr: ChangeDetectorRef, public dialogService: DialogService, private periodoService: PeriodoService) { }

  ngOnInit() {
    this.getPeriodos();

  }

  getPeriodos() {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {
        this.periodos = data.map(
          d => new Periodo(d.id, d.nombre,  d.fecha)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  showCreatePeriodoDialog() {
    this.ref = this.dialogService.open(PeriodoCreate, {
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

  showDeletePeriodoDialog(){
    console.log("aqui la eliminacion");
    
  }

}
