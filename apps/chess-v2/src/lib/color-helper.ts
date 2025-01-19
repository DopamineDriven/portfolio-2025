export const toChessGroundColorHelper = (
  val: "b" | "w" | "white" | "black"
) => {
  return val === "b" || val === "black" ? "black" : "white";
};
