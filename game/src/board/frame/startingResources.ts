import { Cost } from '../../types'
import { withEachPlayer, getCost } from '../player'

export const startingResources = (resources: Cost) => withEachPlayer(getCost(resources))
