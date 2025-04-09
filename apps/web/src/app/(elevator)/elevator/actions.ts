"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookieDomain } from "@/lib/site-domain";

export async function handleElevatorToHomeTransition({
  poi = "/"
}: {
  poi?: string;
}) {
  const cooks = await cookies();
  if (cooks.has("has-visited")) {
    const hasVisited = JSON.parse(
      cooks.get("has-visited")?.value ?? "false"
    ) as boolean;
    if (hasVisited === true) {
      redirect(decodeURIComponent(poi));
    } else {
      try {
        cooks.set({
          name: "has-visited",
          value: "true",
          domain: getCookieDomain(),
          httpOnly: false,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "lax"
        });
      } catch (err) {
        console.error(err);
      } finally {
        redirect(decodeURIComponent(poi));
      }
    }
  } else {
    try {
      cooks.set({
        name: "has-visited",
        value: "true",
        domain: getCookieDomain(),
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax"
      });
    } catch (err) {
      console.error(err);
    } finally {
      redirect(decodeURIComponent(poi));
    }
  }
}
