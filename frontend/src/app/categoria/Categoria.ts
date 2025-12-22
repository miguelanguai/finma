export class Categoria {
    id: number | null;
    nombre: string;
    is_gasto: boolean;
    padre: number | null;

    constructor();
    constructor(id?: number | null, nombre?: string, is_gasto?: boolean, padre?: number);
    constructor(id?: number | null, nombre?: string, is_gasto?: boolean, padre?: number) {
        this.id = id ?? null;
        this.nombre = nombre ?? '';
        this.is_gasto = is_gasto ?? true;
        this.padre = padre ?? null
    }

    
}
