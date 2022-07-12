import { ReactNode } from "react";

type CardProps = {
  label: string;
  highlight: boolean;
};

export default function Card({ label, highlight }: CardProps) {
  return (
    <div>
      <input type="hidden" name="selection" value={label} />
      <button
        type="submit"
        className={`cursor-pointer border-2 p-8 ${highlight && "bg-green-500"}`}
      >
        {label}
      </button>
    </div>
  );
}
