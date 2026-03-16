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

export function objAllVals<TVal>(
  obj: { [key: string]: TVal },
  func: (val: TVal) => boolean,
) {
  return Object.values(obj).filter((x) => !func(x)).length == 0;
}

export function objMerge<T>(
  obj1: { [key: string]: T },
  obj2: { [key: string]: T },
  combFunc: (v1: T, v2: T) => T,
) {
  const result = { ...obj1 };
  for (const k in obj2) {
    if (result[k] === undefined) {
      result[k] = obj2[k];
    } else {
      result[k] = combFunc(result[k], obj2[k]);
    }
  }
  return result;
}

export function approxInt(x: number, epsilon: number = 1e-7): false | number {
  const rounded = Math.round(x);
  if (Math.abs(rounded - x) < epsilon) {
    return false;
  }
  return rounded;
}

export function weightedRandChoice(choicesWithWeights: {
  [key: string]: number;
}) {
  let remainingRan = Math.random();
  for (const choice in choicesWithWeights) {
    remainingRan -= choicesWithWeights[choice];
    if (remainingRan < 0) {
      return choice;
    }
  }
  throw "Probabilities did not add to 1";
}
