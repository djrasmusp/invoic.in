import { snowflakeId } from './columns'

export const seedArrayOfSnowflakeIds = (count: number): number[] => {
  const snowflakeIds = []
  for (let i = 0; i < count; i++) {
    snowflakeIds.push(snowflakeId.generate() as unknown as number)
  }

  return snowflakeIds
}
