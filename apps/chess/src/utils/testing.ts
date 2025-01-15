import fs from "fs";
import { relative } from "path";

const t = fs.readdirSync(relative(process.cwd(), "public/pieces")).map((p) => [`${p.split(".")?.[0]?.replace("-", "_")}`, `https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/${p.split(".")?.[0]}.svg`] as const);


console.log(Object.fromEntries(t))

export const pieceImgObj = {
  black_bishop: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-bishop.svg',
  black_king: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-king.svg',
  black_knight: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-knight.svg',
  black_pawn: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-pawn.svg',
  black_queen: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-queen.svg',
  black_rook: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/black-rook.svg',
  white_bishop: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-bishop.svg',
  white_king: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-king.svg',
  white_knight: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-knight.svg',
  white_pawn: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-pawn.svg',
  white_queen: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-queen.svg',
  white_rook: 'https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess/public/pieces/white-rook.svg'
} as const;
