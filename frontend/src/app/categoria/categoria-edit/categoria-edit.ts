import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { Categoria } from '../Categoria';

@Component({
  selector: 'app-categoria-edit',
  imports: [
    FormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
  ],
  templateUrl: './categoria-edit.html',
  styleUrl: './categoria-edit.css',
})
export class CategoriaEdit {
  categoria: Categoria = new Categoria();
  categoriaList: Categoria[] = [];
  selectedPadre: Categoria = new Categoria();

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    if (this.config.data?.categoria) {
      this.categoria = this.config.data?.categoria;
    } else {
      this.categoria.is_gasto = true;
    }

    this.categoriaList = this.config.data?.categoriaList;
  }

  createCategoria() {
    this.ref.close(this.categoria);
  }
}
