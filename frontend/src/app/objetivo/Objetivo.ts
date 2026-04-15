export class Objetivo {
    id: number | null;
    nombre: string;
    monto: number | null;
    prioridad: string | null;
    fecha: Date;
    is_cumplido: boolean;

    constructor();
    constructor(id?: number | null, nombre?: string, monto?: number | null, prioridad?: string | null, fecha?: string | Date, is_cumplido?: boolean);
    constructor(id?: number | null, nombre?: string, monto?: number | null, prioridad?: string | null, fecha?: string | Date, is_cumplido?: boolean) {
        this.id = id ?? null;
        this.nombre = nombre ?? '';
        this.monto = monto ?? null;
        this.prioridad = prioridad ?? null;
        this.is_cumplido = is_cumplido ?? false;
        if (fecha instanceof Date) {
            this.fecha = fecha;
        } else if (typeof fecha === 'string') {
            this.fecha = new Date(fecha);
        } else {
            this.fecha = new Date();
        }
    }
}
