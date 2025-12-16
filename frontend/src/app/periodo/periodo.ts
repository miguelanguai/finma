export class Periodo {
    nombre: string;
    fecha: Date;
    
    constructor();
    constructor(nombre: string, fecha?: string);
    constructor(nombre?: string, fecha?: string) {
        this.nombre = nombre ?? '';
        this.fecha = fecha ? new Date(fecha) : new Date();
    }
}