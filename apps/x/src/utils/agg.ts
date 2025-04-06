import type { TweetV2, UserV2 } from "twitter-api-v2";
import { Fs } from "@d0paminedriven/fs";

type JSONDATA =
  | {
      tweets: TweetV2[];
      previousToken: string | null;
      nextToken: string | null;
      result_count: number;
      userId: string;
    }
  | {
      tweets: TweetV2[];
      nextToken: string | null;
      result_count: number;
      userId: string;
    };
export const profleData = {
  public_metrics: {
    followers_count: 550,
    following_count: 1249,
    tweet_count: 3549,
    listed_count: 3,
    like_count: 9174,
    media_count: 505
  },
  id: "989610823105568769",
  username: "Dopamine_Driven",
  description: "JAMstack Development Lead at Takeda | TypeScript is 💙",
  name: "Andrew Ross"
};

const _blueHeartEmoji = {
  bytes: new Uint8Array([0xf0, 0x9f, 0x92, 0x99]),
  unicode: `\u{1F499}`,
  surrogatePair: "\uD83D\uDC99"
} as const;

const fs = new Fs(process.cwd());

const toNum = (a: string) => {
  return Number.parseInt(a.split(/\./g)[0] ?? "0", 10);
};

const filesToAggregate = fs
  .readDir("src/utils/__out__", { recursive: true })
  .filter(v => /[0-9]{1,2}.json/.test(v))
  .sort((a, b) => toNum(a) - toNum(b));

console.log(filesToAggregate);

const getAllFiles = (files: string[]) => {
  const arr = Array.of<TweetV2[]>();
  const fs = new Fs(process.cwd());

  try {
    files.forEach(function (file, i) {
      const data = JSON.parse(
        fs.fileToBuffer(`src/utils/__out__/${file}`).toString("utf-8")
      ) as JSONDATA;
      if (i === 0) console.log(data.tweets[0]);
      if ("previousToken" in data) {
        arr.push(data.tweets);
      } else {
        arr.push(data.tweets);
      }
    });
  } catch (err) {
    if (err instanceof TypeError) {
      throw new TypeError(err.message);
    }
    if (err instanceof SyntaxError) {
      throw new SyntaxError(err.message);
    }
    if (err instanceof EvalError) {
      throw new EvalError(err.message);
    }
    if (err instanceof RangeError) {
      throw new RangeError(err.message);
    }
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  } finally {
    return arr;
  }
};

function consolidate(tweetData: TweetV2[][]) {
  const flatten = tweetData.flat(1);

  const fs = new Fs(process.cwd());

  fs.withWs(
    "src/utils/__out__/final/tweets.json",
    JSON.stringify(
      {
        profile: {
          public_metrics: {
            followers_count: 550,
            following_count: 1249,
            tweet_count: 3549,
            listed_count: 3,
            like_count: 9174,
            media_count: 505
          },
          id: "989610823105568769",
          username: "Dopamine_Driven",
          description: "JAMstack Development Lead at Takeda | TypeScript is 💙",
          name: "Andrew Ross"
        } satisfies UserV2,
        tweets: flatten
      } satisfies {profile: UserV2; tweets: TweetV2[]},
      null,
      2
    )
  );
}

consolidate(getAllFiles(filesToAggregate));
