import { RedisClientWrapper } from "@d0paminedriven/redis-utils";

export const redis = new RedisClientWrapper(process.cwd());

export async function incrementCountryVisits(countryCode: string) {
  return redis.withClient(async client => {
    const key = `visits:${countryCode}`;
    return client.incr(key);
  });
}

export async function getCountryVisits() {
  return redis.withClient(async client => {
    const keys = await client.keys("visits:*");
    const visits = await Promise.all(
      keys.map(async key => {
        const count = await client.get(key);
        const country = key.replace("visits:", "");
        return { country, count: parseInt(count ?? "0", 10) };
      })
    );
    return visits;
  });
}
