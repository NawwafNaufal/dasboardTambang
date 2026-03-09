export interface ProductivityIndex {
  lbgJam: number
  mtrJam: number
  ltrMtr: number
}

export interface Activity {
  unit: string
  plan: number
  pa: number
  ua: number
  ma: number
  eu: number
  productivityIndex: ProductivityIndex
}

export interface ProductionUnit {
  date: string
  site: string
  day?: string
  activities: Map<string, Activity[]>
}