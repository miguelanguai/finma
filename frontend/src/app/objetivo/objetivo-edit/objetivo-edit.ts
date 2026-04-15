import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Objetivo } from '../Objetivo';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-objetivo-edit',
  imports: [
    FormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
  ],
  templateUrl: './objetivo-edit.html',
  styleUrl: './objetivo-edit.css',
})
export class ObjetivoEdit {

  objetivo: Objetivo = new Objetivo();

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    if (this.config.data?.objetivo) {
      this.objetivo = this.config.data.objetivo;
    }
  }

  guardarObjetivo() {
    this.ref.close(this.objetivo);
  }

}
