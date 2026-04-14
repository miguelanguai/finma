import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { MapPeriodoCategoria } from '../../periodo/MapPeriodoCategoria';
import { Categoria } from '../Categoria';
import { Periodo } from '../../periodo/periodo';
import { CategoriaService } from '../categoria-service';

interface CategoriaItem extends Categoria {
  _isNew?: boolean;
  _nombre?: string;
}

@Component({
  selector: 'app-mapeo-edit',
  imports: [
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
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

  isEditMode: boolean = false;

  // Multiselect (create mode)
  selectedCategorias: Categoria[] = [];

  // Autocomplete suggestions
  categoriaSugerencias: CategoriaItem[] = [];

  // Inline "crear al vuelo" form
  mostrarFormNuevaCategoria: boolean = false;
  nuevaCategoriaNombre: string = '';
  nuevaCategoriaIsGasto: boolean = true;
  nuevaCategoriaPadre: Categoria | null = null;
  creandoCategoria: boolean = false;

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    if (this.config.data?.mapeo) {
      this.mapeo = { ...this.config.data.mapeo };
      this.isEditMode = true;
    }

    this.mapeoList = this.config.data?.mapeoList ?? [];
    this.categoriaList = this.config.data?.categoriaList ?? [];
    this.periodoList = this.config.data?.periodoList ?? [];
  }

  filtrarCategorias(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase().trim();
    const coincidencias = this.categoriaList.filter(c =>
      c.nombre.toLowerCase().includes(query)
    );
    const hayExacta = this.categoriaList.some(
      c => c.nombre.toLowerCase() === query
    );

    this.categoriaSugerencias = [...coincidencias];

    if (!hayExacta && query) {
      this.categoriaSugerencias.push({
        id: null,
        nombre: `Crear "${event.query}"`,
        is_gasto: true,
        padre: null,
        _isNew: true,
        _nombre: event.query.trim()
      });
    }
  }

  onCategoriaSeleccionada(event: AutoCompleteSelectEvent): void {
    const item = event.value as CategoriaItem;
    if (!item._isNew) return;

    if (this.isEditMode) {
      this.mapeo.categoria = null;
    } else {
      this.selectedCategorias = this.selectedCategorias.filter(
        c => !(c as CategoriaItem)._isNew
      );
    }

    this.nuevaCategoriaNombre = item._nombre!;
    this.nuevaCategoriaIsGasto = true;
    this.nuevaCategoriaPadre = null;
    this.mostrarFormNuevaCategoria = true;
  }

  confirmarNuevaCategoria(): void {
    if (!this.nuevaCategoriaNombre.trim()) return;
    this.creandoCategoria = true;

    const nueva = new Categoria();
    nueva.nombre = this.nuevaCategoriaNombre.trim();
    nueva.is_gasto = this.nuevaCategoriaIsGasto;
    (nueva as any).padre = this.nuevaCategoriaPadre?.id ?? null;

    this.categoriaService.saveCategoria(nueva).subscribe({
      next: (creada) => {
        this.categoriaList = [...this.categoriaList, creada];
        if (this.isEditMode) {
          this.mapeo.categoria = creada;
        } else {
          this.selectedCategorias = [...this.selectedCategorias, creada];
        }
        this.mostrarFormNuevaCategoria = false;
        this.creandoCategoria = false;
      },
      error: (err) => {
        console.error('Error al crear la categoría', err);
        this.creandoCategoria = false;
      }
    });
  }

  cancelarNuevaCategoria(): void {
    this.mostrarFormNuevaCategoria = false;
    this.nuevaCategoriaNombre = '';
  }

  guardar(): void {
    if (this.isEditMode) {
      this.ref.close([this.mapeo]);
    } else {
      const mapeos = this.selectedCategorias.map(cat =>
        new MapPeriodoCategoria(
          null,
          this.mapeo.porc_ideal_fijo ?? undefined,
          this.mapeo.porc_ideal_estimado ?? undefined,
          this.mapeo.porc_ideal_obtenido ?? undefined,
          this.mapeo.periodo ?? undefined,
          cat
        )
      );
      this.ref.close(mapeos);
    }
  }
}
