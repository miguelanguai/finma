export class Periodo {
    nombre: string;
    fecha: Date;

    constructor(nombre: string, fecha: string) {
        this.nombre = nombre;
        this.fecha = new Date(fecha);
    }
}