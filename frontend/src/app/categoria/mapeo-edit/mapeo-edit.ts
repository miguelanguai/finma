import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { MapPeriodoCategoria } from '../../periodo/MapPeriodoCategoria';
import { Categoria } from '../Categoria';
import { Periodo } from '../../periodo/periodo';

@Component({
  selector: 'app-mapeo-edit',
  imports: [
    FormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
  ],
  templateUrl: './mapeo-edit.html',
  styleUrl: './mapeo-edit.css',
})
export class MapeoEdit {
  mapeo: MapPeriodoCategoria = new MapPeriodoCategoria();
  mapeoList: MapPeriodoCategoria[] = [];
  categoriaList: Categoria[] = [];
  periodoList: Periodo[] = [];


  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    if (this.config.data?.mapeo) {
      this.mapeo = this.config.data.mapeo;
    }

    this.mapeoList = this.config.data?.mapeoList;
    this.categoriaList = this.config.data?.categoriaList;
    this.periodoList = this.config.data?.periodoList;
  }

  createMapeo() {    
    this.ref.close(this.mapeo);
  }
}
