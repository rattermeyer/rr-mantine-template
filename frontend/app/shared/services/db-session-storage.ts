import {type Cookie, createSessionStorage, type FlashSessionData, type SessionData} from 'react-router';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';

export function createDatabaseSessionStorage({
                                          cookie
                                      }: { cookie: Cookie }) {
    const db = kyselyBuilder()
    const maxAge = !cookie.expires ? 0 : cookie.expires.getTime() - new Date().getTime();

    return createSessionStorage({
        cookie, async createData(data, expires) {
            const result = await db.insertInto('session').values({
                data,
                expires
            }).returning(["id"]).executeTakeFirstOrThrow()
            console.log("insert session", result.id)
            return result.id
        }, async readData(id): Promise<FlashSessionData<SessionData, SessionData> | null> {
            console.log("read session", id)
            const result = await db.selectFrom('session').where('id', '=', id).selectAll().executeTakeFirst()
            if (!result) {
                return null
            }
            const now = new Date()
            if (result.expires < now) {
                await db.deleteFrom('session').where('id', '=', id).execute()
                return null
            }
            await db.updateTable("session").set({expires: new Date(now.getTime() + maxAge) }).execute()
            return result.data as unknown as FlashSessionData<SessionData, SessionData>
        }, async updateData(id, data, expires) {
            console.log("update session", id)
            const result = await db.selectFrom('session').where('id', '=', id).selectAll().executeTakeFirst()
            if (!result) {
                await db.insertInto('session').values({id, data, expires}).execute()
            } else {
                await db.updateTable("session").set({data, expires}).where('id', '=', id).execute()
            }
        }, async deleteData(id) {
            console.log("delete session", id)
            await db.deleteFrom('session').where('id', '=', id).execute()
        }
    });
}
