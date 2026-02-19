export default function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`h-1.5 flex-1 rounded-full ${index < step ? "bg-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}
