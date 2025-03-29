export const primaryKeyTransformer = (
  sqlResult: { id: string; count: number }[]
): { cursorKeys: string[]; total: number } => {
  return sqlResult.reduce(
    (
      acc: { cursorKeys: string[]; total: number },
      item: { id: string; count: number }
    ) => {
      acc.cursorKeys.push(item.id)
      acc.total = Number(item.count)
      return acc
    },
    { cursorKeys: [], total: 0 }
  )
}
