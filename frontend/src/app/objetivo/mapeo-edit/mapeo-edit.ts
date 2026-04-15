import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

import { MapCategoriaObjetivo } from '../MapCategoriaObjetivo';
import { Categoria } from '../../categoria/Categoria';
import { Objetivo } from '../Objetivo';

@Component({
  selector: 'app-objetivo-mapeo-edit',
  imports: [
    FormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    MultiSelectModule,
    SelectModule,
  ],
  templateUrl: './mapeo-edit.html',
  styleUrl: './mapeo-edit.css',
})
export class ObjetivoMapeoEdit {
  mapeo: MapCategoriaObjetivo = new MapCategoriaObjetivo();
  categoriaList: Categoria[] = [];
  objetivoList: Objetivo[] = [];

  isEditMode: boolean = false;

  // Create mode: multiselect categorias
  selectedCategorias: Categoria[] = [];

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    this.categoriaList = this.config.data?.categoriaList ?? [];
    this.objetivoList = this.config.data?.objetivoList ?? [];

    if (this.config.data?.mapeo) {
      this.mapeo = { ...this.config.data.mapeo };
      this.isEditMode = true;
    } else if (this.config.data?.objetivo) {
      this.mapeo.objetivo = this.config.data.objetivo;
    }
  }

  guardar(): void {
    if (this.isEditMode) {
      this.ref.close([this.mapeo]);
    } else {
      const mapeos = this.selectedCategorias.map(cat =>
        new MapCategoriaObjetivo(null, this.mapeo.fecha_inicio, this.mapeo.fecha_fin, cat, this.mapeo.objetivo)
      );
      this.ref.close(mapeos);
    }
  }

  get puedeGuardar(): boolean {
    if (this.isEditMode) {
      return !!this.mapeo.categoria && !!this.mapeo.objetivo;
    }
    return this.selectedCategorias.length > 0 && !!this.mapeo.objetivo;
  }
}
