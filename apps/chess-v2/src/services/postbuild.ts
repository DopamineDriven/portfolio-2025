import * as dotenv from "dotenv";
import { flags } from "@/utils/flags";
import { SitemapService } from "./sitemap";

dotenv.config();

const s = new SitemapService(flags, process.cwd());

s.exe();
