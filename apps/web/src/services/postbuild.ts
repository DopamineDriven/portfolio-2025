import * as dotenv from "dotenv";
import { SitemapService } from "./sitemap";

dotenv.config();

const s = new SitemapService(process.cwd());

s.exe();
