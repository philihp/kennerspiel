// const BuildingValues = Object.values(BuildingEnum)
// const ResourceValues = Object.values(ResourceEnum)

// function* resourceSlicer(s: string) {
//   for (let i = 0; i + 1 < s.length; i += 2) {
//     const scanned = s.slice(i, i + 2) as ResourceEnum
//     if (ResourceValues.includes(scanned)) yield scanned
//   }
// }

// export const parseResourceParam: (p?: string) => ResourceEnum[] | undefined = (p) => {
//   if (p === undefined) return undefined
//   return [...resourceSlicer(p)]
// }
