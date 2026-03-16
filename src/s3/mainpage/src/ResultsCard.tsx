export function ResultsCard({ debts }: ResultsCardProps) {
  return (
    <>
      {Object.entries(debts).map(([p, d], i) => (
        <div key={i}>
          {p}: £{d.toFixed(2)}
        </div>
      ))}
    </>
  );
}

export type ResultsCardProps = {
  debts: { [person: string]: number };
};
