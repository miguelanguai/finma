export class Categoria {
    id: number | null;
    nombre: string;
    is_gasto: boolean;
    padre: Categoria | null;

    constructor();
    constructor(id?: number | null, nombre?: string, is_gasto?: boolean, padre?: Categoria);
    constructor(id?: number | null, nombre?: string, is_gasto?: boolean, padre?: Categoria) {
        this.id = id ?? null;
        this.nombre = nombre ?? '';
        this.is_gasto = is_gasto ?? true;
        this.padre = padre ?? null
    }


}
