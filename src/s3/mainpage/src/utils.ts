export function objMap<TVal, TValRet>(
  obj: { [key: string]: TVal },
  func: (key: string, val: TVal) => [key: string, val: TValRet],
) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => func(k, v)));
}
export function objMapVals<TVal, TValRet>(
  obj: { [key: string]: TVal },
  func: (val: TVal) => TValRet,
) {
  return objMap(obj, (k, v) => [k, func(v)]);
}
