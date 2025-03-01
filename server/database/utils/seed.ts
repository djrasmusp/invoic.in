import { snowflake } from '@@/server/database/utils/columns'

export const seedArrayOfSnowflakeIds = (count: number): number[] => {
  const snowflakeIds = []
  for (let i = 0; i < count; i++) {
    snowflakeIds.push(snowflake.generate() as unknown as number)
  }

  return snowflakeIds
}
