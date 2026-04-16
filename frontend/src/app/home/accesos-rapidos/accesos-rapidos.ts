import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AccesoRapido {
  label: string;
  ruta: string;
  icono: string;
}

@Component({
  selector: 'app-accesos-rapidos',
  imports: [RouterLink],
  templateUrl: './accesos-rapidos.html',
  styleUrl: './accesos-rapidos.css',
})
export class AccesosRapidos {
  accesos: AccesoRapido[] = [
    { label: 'Periodos', ruta: '/periodo', icono: 'pi pi-calendar' },
    { label: 'Categorías', ruta: '/categoria', icono: 'pi pi-tag' },
    { label: 'Movimientos', ruta: '/movimiento', icono: 'pi pi-list' },
    { label: 'Análisis', ruta: '/analisis', icono: 'pi pi-chart-bar' },
    { label: 'Objetivos', ruta: '/objetivo', icono: 'pi pi-flag' },
  ];
}
