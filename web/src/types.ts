export enum EngineColor {
  red = 'RED',
  blue = 'BLUE',
  green = 'GREEN',
  white = 'WHITE',
}

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

export type Instance = {
  id: string
  commands: string[]
}
