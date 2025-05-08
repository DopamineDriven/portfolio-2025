export const getProcess = process.env.npm_config_user_agent;

function getPackageManager() {
  if (process.env.npm_config_user_agent) {
    return `pnpm@${/pnpm\/([0-9]+.[0-9]+.[0-9]+)/g.exec(process.env.npm_config_user_agent)?.[1]}` as const;
  } else return `pnpm` as const;
}

console.log(getPackageManager());
console.log(getProcess)
