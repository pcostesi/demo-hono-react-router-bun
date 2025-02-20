import { Hono } from 'hono'
import remixSessionMiddleware from './middlewares/remix-session'
import { ENV } from './env'

import { createHonoServer } from "react-router-hono-server/bun";
import { getLoadContext } from './context';

import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(ENV.DATABASE_URL);


const app = new Hono()


app.get("/api", async (c: any) => {
  const result = await db.run("select 1;").execute()
  const rows = result.rows
  return c.json({ "res": "ok", "rows": rows })
})

app.use(remixSessionMiddleware())

export default await createHonoServer({ app, getLoadContext })
