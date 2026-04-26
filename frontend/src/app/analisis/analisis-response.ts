export interface UltimoMovimientoResponse {
  id: number;
  fecha: string;
  concepto: string;
  importe: number;
  tipo: 'gasto' | 'ingreso';
  categoria: string | null;
}

export interface GastoCategoriaLandingItem {
  categoria: string;
  total: number;
}

export interface ResumenLandingResponse {
  periodo_activo: { id: number; nombre: string; fecha_inicio: string; fecha_fin: string } | null;
  balance_periodo: number;
  total_gasto_periodo: number;
  total_ingreso_periodo: number;
  num_movimientos: number;
  ultimos_movimientos: UltimoMovimientoResponse[];
  objetivos_progreso: ProgresoObjetivoResponse[];
  gastos_por_categoria: GastoCategoriaLandingItem[];
}

export interface ProgresoObjetivoResponse {
  id: number;
  nombre: string;
  monto: number;
  acumulado: number;
  porcentaje: number;
  fecha_prevista: string | null;
}

export interface GastoCategoriaResponse {
  categoria: { id: number; nombre: string };
  gastos_por_mes: { periodo: string; gasto: number }[];
  gasto_anual: number;
  prev_minima: number;
  prev_maxima: number;
  prev_media: number;
}

export interface BalanceMesResponse {
  periodo: string;
  balance: number;
}

export interface BalanceAnualResponse {
  balance_actual: number;
  prev_minima: number;
  prev_maxima: number;
  prev_media: number;
  balance_por_mes: BalanceMesResponse[];
}

export interface ComparativaCategoriaItem {
  categoria: { id: number; nombre: string };
  gasto_periodo1: number;
  gasto_periodo2: number;
  diferencia_porcentual: number | null;
}

export interface ComparativaResponse {
  periodo1: { id: number; nombre: string };
  periodo2: { id: number; nombre: string };
  categorias: ComparativaCategoriaItem[];
}
