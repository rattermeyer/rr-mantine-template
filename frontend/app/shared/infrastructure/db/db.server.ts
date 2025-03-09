import {
	CamelCasePlugin,
	Kysely,
	ParseJSONResultsPlugin,
	PostgresDialect,
} from "kysely";
import pg from "pg";
import type { DB } from "~/shared/infrastructure/db/model/kysely/tables";

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const kyselyBuilder = () =>
	new Kysely<DB>({
		dialect: new PostgresDialect({
			pool: {
				connect: async () => {
					// TODO could customize connection before returning client.
					return await pool.connect();
				},
				end: () => pool.end(),
			},
		}),
		plugins: [new ParseJSONResultsPlugin(), new CamelCasePlugin()],
		log: ["query", "error"],
	});
