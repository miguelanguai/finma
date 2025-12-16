import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { PeriodoService } from '../periodo-service';
import { Periodo } from '../periodo';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-periodo-list',
  imports: [
    ButtonModule,
    TableModule
  ],
  templateUrl: './periodo-list.html',
  styleUrl: './periodo-list.css',
})
export class PeriodoList implements OnInit {

  constructor(private periodoService: PeriodoService, private cdr: ChangeDetectorRef) { }

  periodos: Periodo[] = [];

  ngOnInit() {
    this.getPeriodos();

  }

  getPeriodos() {
    this.periodoService.getPeriodos().subscribe({
      next: (data) => {
        this.periodos = data.map(d => new Periodo(d.nombre, d.fecha));

        //this.periodos = data;
        this.cdr.detectChanges();
        console.log(typeof this.periodos);
        console.log(this.periodos[0]);
        console.log(this.periodos[0] instanceof Periodo);
        console.log(this.periodos[0].fecha instanceof Date);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
