import * as dotenv from "dotenv";
import expand from "dotenv-expand";

export class EnvHandler {
  private readonly parsedEnv: { [key: string]: string };

  constructor(public cwd: string) {
    this.cwd = cwd ??= process.cwd();
    const result = dotenv.config({ path: `${this.cwd}/.env` });
    this.parsedEnv = expand.expand(result).parsed ?? {};
  }

  public get redisEnv() {
    if (this.parsedEnv.REDIS_URL) {
      return this.parsedEnv satisfies { [key: string]: string } as {
        [key: string]: string;
        REDIS_URL: string;
      };
    }
    throw new Error(
      "Required REDIS_URL env variable is not defined in .env or .env.local"
    );
  }
}
