export class Periodo {
    id: number | undefined;
    nombre: string;
    fecha: Date;
    
    constructor();
    constructor(id?: number | undefined, nombre?: string, fecha?: string | Date);
    constructor(id?: number | undefined, nombre?: string, fecha?: string | Date) {
        this.id = id ?? undefined;
        this.nombre = nombre ?? '';
        if (fecha instanceof Date){
            this.fecha = fecha;
        } else if(typeof fecha == "string"){
            this.fecha = new Date(fecha);
        } else{
            this.fecha = new Date()
        }
    }

    public getNombre():string{
        return this.nombre;
    }

    public getFecha(): Date{
        return this.fecha;
    }

    public getFechaAsString():string{
        return this.fecha.getFullYear()+"-"+this.fecha.getMonth()+"-"+this.fecha.getDate();
    }
}