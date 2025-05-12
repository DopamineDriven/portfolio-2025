import { Fs } from "@d0paminedriven/fs";

export const getProcess = process.env.npm_config_user_agent;

function getPackageManager(fs: InstanceType<typeof Fs>) {
  if (process.env.npm_config_user_agent) {
    return `pnpm@${/pnpm\/([0-9]+.[0-9]+.[0-9]+)/g.exec(process.env.npm_config_user_agent)?.[1]}` as const;
  } else {
    try {
      const programmaticallyExtract = fs.executeCommand({
        command: "pnpm -v",
        cwd: fs.cwd
      });
      if (programmaticallyExtract.length > 1) {
        return `pnpm@${programmaticallyExtract}` as const;
      } else {
        // prettier-ignore
        fs.executeCommand({
          command: "curl -fsSL https://get.pnpm.io/install.sh | sh - \
&& corepack use pnpm@latest",
          cwd: fs.cwd
        });
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      else {
        console.error(err);
      }
    }
  }
}

console.log(getPackageManager(new Fs(process.cwd())));
console.log(getProcess);
