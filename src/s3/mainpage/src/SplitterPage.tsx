import { useRef, useState } from "react";
import { ResultsCard } from "./ResultsCard";
import { SplitterCard, SplitterCardDivider } from "./SplitterCard";
import {
  approxInt,
  objMap,
  objMapVals,
  objMerge,
  weightedRandChoice,
} from "./utils";

export function SplitterPage({ items, groups }: SplitterPageProps) {
  const mkEmptyShares: () => Shares = () => objMap(groups, (gn, _) => [gn, 0]);
  const itemsSplit = useRef<ItemSplit[]>(
    items.map((i) => ({ shares: mkEmptyShares(), ...i })),
  );
  const [debts, setDebts] = useState<{ [person: string]: number }>({});

  return (
    <div>
      <div className=" p-1">
        {items.map((itemOnly, index) => (
          <>
            <SplitterCard
              itemOnly={itemOnly}
              groups={groups}
              adjustShares={(s) => {
                itemsSplit.current[index].shares = s;
                const newDebts = processSplit(itemsSplit.current, groups);
                setDebts(newDebts);
              }}
              key={index}
            />
            {index < items.length - 1 && <SplitterCardDivider />}
          </>
        ))}
      </div>
      <ResultsCard
        debts={debts}
        total={itemsSplit.current.reduce((t, c) => t + c.price, 0)}
      />
    </div>
  );
}

function processSplit(items: ItemSplit[], groups: Groups) {
  let debtsByPerson: { [person: string]: number } = {};
  for (const item of items) {
    const shares = item.shares;
    const allShareCnt = Object.values(shares).reduce((t, c) => t + c, 0);
    const proportions = {} as { [person: string]: number };

    // if no shares specified, dont split
    if (allShareCnt == 0) continue;

    for (const groupName in groups) {
      const grpShareCnt = shares[groupName];
      const grpProp = grpShareCnt / allShareCnt;
      const memberShares = groups[groupName].memberShares;
      const grpInternalShareCnt = Object.values(memberShares).reduce(
        (t, c) => t + c,
        0,
      );
      for (const person in memberShares) {
        const indivShareCnt = memberShares[person];
        const indivProp = grpProp * (indivShareCnt / grpInternalShareCnt);
        proportions[person] = (proportions[person] ?? 0) + indivProp;
      }
    }
    // now `proportions` contains fractions for each individual person for this item.
    const debts = propsToMoney(proportions, item.price);
    debtsByPerson = objMerge(debtsByPerson, debts, (x, y) => x + y);
  }
  return debtsByPerson;
}

/**
 *
 * @param proportions Converts proportional splits to actual monetary amounts, randmonly distributing fractional pennies
 * @param price
 */
function propsToMoney(
  proportions: { [person: string]: number },
  price: number,
) {
  const pennyPrice = price * 100;

  const withFractionalPennies = objMapVals(proportions, (v) => v * pennyPrice);
  const fractionalPennies = objMapVals(withFractionalPennies, (v) => v % 1);
  const intPennies = objMapVals(withFractionalPennies, Math.floor);
  const totalFractionalPennies = Object.values(fractionalPennies).reduce(
    (t, c) => t + c,
    0,
  );

  //distribute partial pennies randomly
  const roundedFracPennies = approxInt(totalFractionalPennies); // resolve rounding errors
  if (roundedFracPennies === false)
    throw "Not an int number of pennies to distribute";
  const randPennyWeights = objMapVals(
    fractionalPennies,
    (x) => x / roundedFracPennies,
  ); // normalise into probability mass function for penny distribution
  for (let i = 0; i < roundedFracPennies; i++) {
    const person = weightedRandChoice(randPennyWeights);
    intPennies[person]++;
  }

  //convert back to pounds
  const inPounds = objMapVals(intPennies, (x) => x / 100);
  return inPounds;
}

export type SplitterPageProps = {
  items: ItemOnly[];
  groups: Groups;
};

export type ItemOnly = {
  name: string;
  price: number;
};
export type ItemSplit = ItemOnly & { shares: Shares };

export type Groups = {
  [groupName: string]: GroupData;
};
export type GroupData = {
  symbol: string;
  memberShares: { [name: string]: number };
};

export type Shares = { [groupName: string]: number };
