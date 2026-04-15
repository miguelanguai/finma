import { Categoria } from '../categoria/Categoria';
import { Objetivo } from './Objetivo';

export class MapCategoriaObjetivo {
    id: number | null;
    fecha_inicio: Date;
    fecha_fin: Date;
    categoria: Categoria | null;
    objetivo: Objetivo | null;

    constructor();
    constructor(id?: number | null, fecha_inicio?: string | Date, fecha_fin?: string | Date, categoria?: Categoria | null, objetivo?: Objetivo | null);
    constructor(id?: number | null, fecha_inicio?: string | Date, fecha_fin?: string | Date, categoria?: Categoria | null, objetivo?: Objetivo | null) {
        this.id = id ?? null;
        this.categoria = categoria ?? null;
        this.objetivo = objetivo ?? null;
        if (fecha_inicio instanceof Date) {
            this.fecha_inicio = fecha_inicio;
        } else if (typeof fecha_inicio === 'string') {
            this.fecha_inicio = new Date(fecha_inicio);
        } else {
            this.fecha_inicio = new Date();
        }
        if (fecha_fin instanceof Date) {
            this.fecha_fin = fecha_fin;
        } else if (typeof fecha_fin === 'string') {
            this.fecha_fin = new Date(fecha_fin);
        } else {
            this.fecha_fin = new Date();
        }
    }
}
