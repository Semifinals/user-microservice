/**
 * Names of each JS type.
 */
type Type =
  | "bigint"
  | "boolean"
  | "number"
  | "object"
  | "string"
  | "symbol"
  | "undefined"

/**
 * Props for a paramaterized test.
 */
type ParamaterizedTestProps<T> = {
  variation: T
  key: string
  value: string
}

/**
 * Run a paramaterized test.
 *
 * @param params The parameters to test, with each of the values to test
 * @returns A function to call that creates a test
 */
export function each<T extends object>(
  valid: T,
  params: Record<keyof T, any[]>
) {
  return (test: (props: ParamaterizedTestProps<T>) => Promise<void>) =>
    it.each(
      Object.entries<any[]>(params).flatMap(([key, values]) =>
        values.map(value => ({
          variation: { ...valid, [key]: value },
          key,
          value
        }))
      )
    )("$key: $value", test)
}

/**
 * Create a parameter list for testing that test all parameter types except the
 * one given.
 *
 * @param type The type to exclude
 * @param overrides Overrides for values for each of the types
 * @returns A parameter list to use for testing
 */
export function except<T extends Type>(
  type: T | Type[],
  overrides: Partial<Record<Exclude<Type, T>, any[]>> = {}
) {
  const uncleaned: Record<Type, any[]> = Object.assign(
    {
      bigint: [BigInt(1)],
      boolean: [true],
      number: [1],
      object: [{ key: "value" }],
      string: ["value"],
      symbol: [Symbol("symbol")],
      undefined: [undefined]
    },
    overrides
  )

  if (Array.isArray(type)) type.forEach(t => delete uncleaned[t])
  else delete uncleaned[type]

  return Object.values(uncleaned).flat()
}
