import { createClient } from "@redis/client";
import type { RedisClientOptions, RedisClientType } from "@redis/client";
import { EnvHandler } from "./env.ts";

export default class RedisClientWrapper extends EnvHandler {
  private client: RedisClientType;

  constructor(
    public override cwd: string,
    public options: Omit<RedisClientOptions, "url"> = {}
  ) {
    super((cwd ??= process.cwd()));

    this.client = createClient({
      url: this.redisEnv.REDIS_URL,
      ...(this.options as Omit<RedisClientOptions, "url">) // ← assert explicitly
    }) as RedisClientType; // ← final assertion to suppress conflict

    this.client.on("error", err => console.error("Redis Client Error", err));
    this.client.on("connect", () => console.log("Redis Client Connected"));
  }

  public async connect() {
    if (!this.client.isOpen) await this.client.connect();
  }

  public async disconnect() {
    if (this.client.isOpen) await this.client.quit();
  }

  public async withClient<T>(
    operation: (client: RedisClientType) => Promise<T>
  ): Promise<T> {
    await this.connect();
    try {
      return await operation(this.client);
    } catch (err) {
      throw new Error("withClient error", { cause: err });
    } finally {
      await this.disconnect();
    }
  }
}
