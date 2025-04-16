import { beforeAll } from "vitest";
import db from "../database/db.js";


beforeAll(async () => {
    if (process.env.NODE_ENV = 'test') {
        await db.sync()
    }
})