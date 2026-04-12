export function ResultsCard({ debts, total }: ResultsCardProps) {
  const totalSplit = Object.values(debts).reduce((t, c) => t + c, 0);
  const toDisplay = { ...debts, "Total (Split)": totalSplit, Total: total };

  return (
    <div className="p-1">
      <div className="p-2 bg-indigo-600 rounded-xl">
        <h3 className="text-zinc-200 text-xl text-center">Splits</h3>
        {Object.entries(toDisplay).map(([p, d], i) => (
          <div
            key={i}
            className=" text-zinc-200 text-center bg-indigo-700 rounded-2xl mx-auto px-5 my-1 w-fit"
          >
            {p}: £{d.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

export type ResultsCardProps = {
  debts: { [person: string]: number };
  total: number;
};
