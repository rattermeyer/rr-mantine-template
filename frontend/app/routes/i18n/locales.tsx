import type {Route} from './+types/locales';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import type {DB} from '~/shared/infrastructure/db/model/kysely/tables';
import type {Kysely} from 'kysely';

/**
 * This action is used to report missing translations to the server.
 * And store them for examination into the DB table `missingTranslations`.
 */
export async function action({request, params}: Route.ActionArgs) {
    const {lng, ns} = params;
    const db: Kysely<DB> = kyselyBuilder()
    const body = await request.text();
    const parsedBody = JSON.parse(body);
    const values: {
        language: string,
        namespace: string,
        defaultValue: string,
        key: string,
        reportedAt: Date
    }[] = [];
    const reportedAt = new Date();
    for (const key of Object.keys(parsedBody)) {
        values.push({
            language: lng ?? 'unknown',
            namespace: ns ?? 'unknown',
            defaultValue: parsedBody[key],
            key,
            reportedAt
        })
    }
    await db.insertInto('missingTranslations').values(
        values
    ).onConflict((oc) => oc.doNothing()).execute();
    return null
}
