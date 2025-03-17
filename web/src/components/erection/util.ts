import { BuildingEnum } from 'hathora-et-labora-game/dist/types'

export const partiallyUsed = (buildingIs: BuildingEnum[], partial: string[] = []) => {
  return partial?.[0] === 'USE' && buildingIs.includes(partial?.[1] as BuildingEnum) && partial.length === 2
}
