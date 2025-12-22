export class Categoria {
    private id: number | null;
    private nombre: string;
    private is_gasto: boolean;
    private padre: Categoria | null;

    constructor();
    constructor(id?: number | null, nombre?: string, is_gasto?: boolean, padre?: Categoria);
    constructor(id?: number | null, nombre?: string, is_gasto?: boolean, padre?: Categoria) {
        this.id = id ?? null;
        this.nombre = nombre ?? '';
        this.is_gasto = is_gasto ?? true;
        this.padre = padre ?? null
    }

    // Getters & Setters

    public getId(): number | null {
        return this.id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public getIsGasto(): boolean {
        return this.is_gasto;
    }

    public getPadre(): Categoria | null {
        return this.padre;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public setIsGasto(is_gasto: boolean): void {
        this.is_gasto = is_gasto;
    }

    public setPadre(padre: Categoria): void {
        this.padre = padre;
    }
}