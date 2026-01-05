export class Periodo {
    id: number | undefined;
    nombre: string;
    fecha: Date;
    ingreso_fijo: number | undefined;
    ingreso_estimado: number | undefined;

    constructor();
    constructor(id?: number | undefined, nombre?: string, fecha?: string | Date, ingreso_fijo?: number | undefined, ingreso_estimado?: number | undefined);
    constructor(id?: number | undefined, nombre?: string, fecha?: string | Date, ingreso_fijo?: number | undefined, ingreso_estimado?: number | undefined) {
        this.id = id ?? undefined;
        this.nombre = nombre ?? '';
        this.ingreso_fijo = ingreso_fijo ?? undefined;
        this.ingreso_estimado = ingreso_estimado ?? undefined;
        if (fecha instanceof Date) {
            this.fecha = fecha;
        } else if (typeof fecha == "string") {
            this.fecha = new Date(fecha);
        } else {
            this.fecha = new Date()
        }
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getFecha(): Date {
        return this.fecha;
    }

    public getFechaAsString(): string {
        return this.fecha.getFullYear() + "-" + (this.fecha.getMonth()+1) + "-" + this.fecha.getDate();
    }
}