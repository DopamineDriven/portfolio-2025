import { python } from "pythonia";

(async () => {
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const time = await python("../../public/time.py");
  //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const [getTime] = await Promise.all<string>([time.what_time_is_it()]);
  return getTime;
})().then(getTime => {
  console.log(getTime);
  python.exit();
  return;
});
