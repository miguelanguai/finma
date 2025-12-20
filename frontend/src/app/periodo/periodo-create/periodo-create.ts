import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Periodo } from '../periodo';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-periodo-create',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule
  ],
  templateUrl: './periodo-create.html',
  styleUrl: './periodo-create.css',
})
export class PeriodoCreate {

  periodo: Periodo = new Periodo();

  constructor(private ref: DynamicDialogRef){}

  createPeriodo(){
    this.ref.close(this.periodo);
  }

}
