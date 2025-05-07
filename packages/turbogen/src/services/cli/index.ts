import { InquirerService } from "./inquirer.js";

export interface CliServiceProps {
  i: InquirerService;
}

export function cliService(
  input: typeof import("@inquirer/prompts").input
) {
  return {
    i: new InquirerService(input)
  };
}
