export interface UltimoMovimientoResponse {
  id: number;
  fecha: string;
  concepto: string;
  importe: number;
  tipo: 'gasto' | 'ingreso';
  categoria: string | null;
}

export interface ResumenLandingResponse {
  periodo_activo: { id: number; nombre: string; fecha_inicio: string; fecha_fin: string } | null;
  balance_periodo: number;
  total_gasto_periodo: number;
  total_ingreso_periodo: number;
  num_movimientos: number;
  ultimos_movimientos: UltimoMovimientoResponse[];
  objetivos_progreso: ProgresoObjetivoResponse[];
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
  categoria: string;
  categoria_path?: string;
  gastos_por_mes: { [periodo: string]: number };
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
  meses: BalanceMesResponse[];
}
