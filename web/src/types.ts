export enum EngineCountry {
  france = 'FRANCE',
  ireland = 'IRELAND',
}

export enum EngineLength {
  short = 'SHORT',
  long = 'LONG',
}

export type EngineConfig = {
  country: EngineCountry
  length: EngineLength
}
