import { ChangeDetectorRef, Component } from '@angular/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { Categoria } from '../Categoria';
import { CategoriaService } from '../categoria-service';
import { CategoriaEdit } from '../categoria-edit/categoria-edit';

@Component({
  selector: 'app-categoria-list',
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
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.css',
})
export class CategoriaList {
  categorias: Categoria[] = [];

  ref: DynamicDialogRef | null = null;

  constructor(private cdr: ChangeDetectorRef, private confirmationService: ConfirmationService, public dialogService: DialogService, private messageService: MessageService, private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.getCategorias();

  }

  getCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data.map(
          d => new Categoria(d.id, d.nombre, d.is_gasto, d.padre ?? undefined)
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  showCreateCategoriaDialog(categoria?: Categoria) {
      this.ref = this.dialogService.open(CategoriaEdit, {
        data: {
          categoria: categoria ?? null,
          categoriaList: this.categorias
        },
        header: "select",
        closeOnEscape: true,
        closable: true,
        resizable: true,
        draggable: true,
      })
  
      this.ref?.onClose.subscribe((returnedCategoria: Categoria) => {
        if (returnedCategoria) {
          this.categoriaService.saveCategoria(returnedCategoria).subscribe({
            next: () => {
              this.ngOnInit();
              if (categoria) {
  
                this.messageService.add({
                  severity: "info",
                  summary: "Confirmado",
                  detail: "Has editado la categoria"
                });
              } else {
                this.messageService.add({
                  severity: "info",
                  summary: "Confirmado",
                  detail: "Has creado la categoria"
                });
              }
            },
            error: err => {
              console.error("Error al guardar el categoria", err);
            }
          });
        }
      });
    }

  showDeleteCategoriaDialog(categoria: Categoria, event: Event) {
    this.confirmationService.confirm({
      header: "¿Borrar categoria?",
      message: "Confirma para continuar",
      accept: () => {
        this.categoriaService.deleteCategoria(categoria).subscribe({
          next: (data) => {
          }
        })
        this.messageService.add({
          severity: "info",
          summary: "Confirmado",
          detail: "Has eliminado la categoria"
        });
        this.ngOnInit();
        this.getCategorias();
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rechazado",
          detail: "La categoria sigue existiendo"
        })
      }
    })
  }
}
