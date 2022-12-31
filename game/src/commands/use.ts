import { BuildingEnum, GameCommandUseParams, GameStatePlaying, ResourceEnum } from '../types'

type UseParser = (params: string[]) => GameCommandUseParams

const BAD_PARSE: GameCommandUseParams = {}

const BuildingValues = Object.values(BuildingEnum)
const ResourceValues = Object.values(ResourceEnum)

function* resourceSlicer(s: string) {
  for (let i = 0; i + 1 < s.length; i += 2) {
    const scanned = s.slice(i, i + 2) as ResourceEnum
    if (ResourceValues.includes(scanned)) yield scanned
  }
}

export const parseResourceParam: (p?: string) => ResourceEnum[] | undefined = (p) => {
  if (p === undefined) return undefined
  return [...resourceSlicer(p)]
}

export const parse: UseParser = (params) => {
  if (params === undefined) return BAD_PARSE
  if (params.length < 1) return BAD_PARSE
  const [buildingCode, p1, p2] = params
  if (!BuildingValues.includes(buildingCode as BuildingEnum)) return BAD_PARSE
  if (params.length === 1) {
    return {
      building: buildingCode as BuildingEnum,
    }
  }
  if (params.length === 2) {
    return {
      building: buildingCode as BuildingEnum,
      p1: parseResourceParam(p1),
    }
  }
  if (params.length === 3) {
    return {
      building: buildingCode as BuildingEnum,
      p1: parseResourceParam(p1),
      p2: parseResourceParam(p2),
    }
  }
  return BAD_PARSE
}

export const use = (state: GameStatePlaying, params: GameCommandUseParams): GameStatePlaying => {
  return {
    ...state,
  }
}
