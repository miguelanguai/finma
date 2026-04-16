import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';

import { MovimientoService } from '../movimiento-service';

@Component({
  selector: 'app-excel-upload',
  imports: [
    ButtonModule,
    FileUploadModule,
    MessageModule,
  ],
  templateUrl: './excel-upload.html',
  styleUrl: './excel-upload.css',
})
export class ExcelUpload {
  archivoSeleccionado: File | null = null;
  cargando = false;
  errorMensaje: string | null = null;

  constructor(
    private ref: DynamicDialogRef,
    private movimientoService: MovimientoService,
  ) { }

  onFileSelect(event: FileSelectEvent) {
    this.archivoSeleccionado = event.files[0] ?? null;
    this.errorMensaje = null;
  }

  subir() {
    if (!this.archivoSeleccionado) return;

    this.cargando = true;
    this.errorMensaje = null;

    this.movimientoService.uploadExcel(this.archivoSeleccionado).subscribe({
      next: () => {
        this.cargando = false;
        this.ref.close(true);
      },
      error: () => {
        this.cargando = false;
        this.errorMensaje = 'El período no se encontró. Comprueba que el nombre del archivo sigue el formato YY-MM (ej. 25-04_extracto.xlsx).';
      },
    });
  }
}
