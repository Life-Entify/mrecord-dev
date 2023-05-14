export function queryStringBuilder<Q, T>(
  query?: (keyof Q)[] | (keyof T)[],
  nestedValues?: T
) {
  let queryString = "";
  if (query)
    for (let i = 0; i < query.length; i++) {
      const element = query?.[i];
      if (nestedValues?.[element as keyof T]) {
        queryString += `${String(element)} { ${queryStringBuilder(
          nestedValues[element as keyof T] as (keyof T)[],
          nestedValues
        )} }`;
      } else queryString += `${String(element)} `;
    }
  return queryString;
}
