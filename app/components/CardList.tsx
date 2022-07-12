import { ReactNode } from "react";

type CardListProps = {
  children: ReactNode;
};

export default function CardList({ children }: CardListProps) {
  return <div className="my-8 flex space-x-4">{children}</div>;
}
