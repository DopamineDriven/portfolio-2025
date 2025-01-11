import React from "react";
import Link from "next/link";
import { Button, Tooltip } from "@nextui-org/react";
import { BlackKing, WhiteKing } from "./chess-vectors";

interface PlayAsButtonProps {
  target: "Black" | "White";
  href: string;
  stockfishLevel: number;
}

const PlayAsButton: React.FC<PlayAsButtonProps> = ({ target, href }) => (
  <Tooltip content={target}>
    <Link href={href}>
      <Button
        isIconOnly
        size="lg"
        radius="none"
        color="default"
        variant="ghost"
        className="mx-1 bg-zinc-800">
        {target === "White" ? (
          <WhiteKing className="h-12 w-12" />
        ) : (
          <BlackKing className="h-12 w-12" />
        )}
      </Button>
    </Link>
  </Tooltip>
);

export default PlayAsButton;
