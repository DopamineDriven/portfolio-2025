import type {
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts
} from "redis";
import { createClient } from "redis";
import { EnvHandler } from "./env.ts";

export default class RedisClientWrapper<
  M extends RedisModules = RedisModules,
  F extends RedisFunctions = RedisFunctions,
  S extends RedisScripts = RedisScripts
> extends EnvHandler {
  private client: RedisClientType<M, F, S>;

  constructor(
    public override cwd: string,
    public options: RedisClientOptions<M, F, S> = {}
  ) {
    super((cwd ??= process.cwd()));
    this.client = createClient({
      url: this.redisEnv.REDIS_URL,
      ...options
    });

    this.client.on("error", err => console.error("Redis Client Error", err));
    this.client.on("connect", () => console.log("Redis Client Connected"));
  }

  public async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async disconnect() {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  public async withClient<T>(
    operation: (client: RedisClientType<M, F, S>) => Promise<T>
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
