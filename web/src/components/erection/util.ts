import { BuildingEnum } from 'hathora-et-labora-game/dist/types'
import { ascend, join, sort, identity, splitEvery, reduce } from 'ramda'

export const partiallyUsed = (buildingIs: BuildingEnum[], partial: string[] = []): boolean => {
  return partial?.[0] === 'USE' && buildingIs.includes(partial?.[1] as BuildingEnum) && partial.length === 2
}

export const normalize = (inv: string) => join('', sort(ascend(identity), splitEvery(2, inv)))

export const genDenormalize = reduce(
  (accum: Record<string, string>, key: string) => ({
    ...accum,
    [normalize(key)]: key,
  }),
  {} as Record<string, string>
)
