import { Categoria } from "../categoria/Categoria";
import { Periodo } from "./periodo";

export class MapPeriodoCategoria {
    id: number | null;
    porc_ideal_fijo: number | null;
    porc_ideal_estimado: number | null;
    porc_ideal_obtenido: number | null;
    periodo: Periodo | null;
    categoria: Categoria | null;

    constructor();
    constructor(id?: number | null, porc_ideal_fijo?: number, porc_ideal_estimado?: number, porc_ideal_obtenido?: number, periodo?: Periodo, categoria?: Categoria);
    constructor(id?: number | null, porc_ideal_fijo?: number, porc_ideal_estimado?: number, porc_ideal_obtenido?: number, periodo?: Periodo, categoria?: Categoria) {
        this.id = id ?? null;
        this.porc_ideal_fijo = porc_ideal_fijo ?? null;
        this.porc_ideal_estimado = porc_ideal_estimado ?? null;
        this.porc_ideal_obtenido = porc_ideal_obtenido ?? null;
        this.periodo = periodo ?? null;
        this.categoria = categoria ?? null;
    }
}