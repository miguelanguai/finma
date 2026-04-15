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
