import { Fs } from "@d0paminedriven/fs";

function getPackageManager2(withCli = false) {
  const fs = new Fs(process.cwd());
  if (withCli === false) {
    if (process.env.npm_config_user_agent) {
      return `pnpm@${/pnpm\/([0-9]+.[0-9]+.[0-9]+)/g.exec(process.env.npm_config_user_agent)?.[1]}` as const;
    } else return `pnpm` as const;
  } else {
    const c = fs.executeCommand({
      command: "pnpm -v",
      cwd: fs.cwd
    });
    return `cli pnpm@${c.trim()}` as const;
  }
}

const p = (argv = process.argv[2]) => {
  if (argv === "true") return true;
  else if (argv === "false") return false;
  else return false;
};

console.log(getPackageManager2(p(process.argv[2])));
