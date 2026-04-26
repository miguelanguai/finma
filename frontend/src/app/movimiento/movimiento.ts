import { Categoria } from "../categoria/Categoria";
import { Periodo } from "../periodo/periodo";

export class Movimiento {
    id: number | undefined;
    concepto: string;
    monto: number | undefined;
    fecha: Date;
    recurrente: boolean | undefined;
    notas: string | null;
    periodo: Periodo | null;
    categoria: Categoria | null;

    constructor();
    constructor(id?: number | null, concepto?: string, monto?: number, fecha?: string | Date, recurrente?: boolean, notas?: string, periodo?: Periodo, categoria?: Categoria);
    constructor(id?: number | null, concepto?: string, monto?: number, fecha?: string | Date, recurrente?: boolean, notas?: string, periodo?: Periodo, categoria?: Categoria) {
        this.id = id ?? undefined;
        this.concepto = concepto ?? "";
        this.monto = monto != null ? Number(monto) : undefined;
        if (fecha instanceof Date) {
            this.fecha = fecha;
        } else if (typeof fecha == "string") {
            this.fecha = new Date(fecha);
        } else {
            this.fecha = new Date()
        }
        this.recurrente = recurrente ?? undefined;
        this.notas = notas ?? null;
        this.periodo = periodo ?? null;
        this.categoria = categoria ?? null;
    }
}