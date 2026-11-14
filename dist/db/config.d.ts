import "dotenv/config";
import * as schemas from "./schema.js";
import { Pool } from "pg";
export declare const pool: Pool;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schemas> & {
    $client: Pool;
};
//# sourceMappingURL=config.d.ts.map