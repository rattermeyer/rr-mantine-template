import type { OAuth2Tokens } from "arctic";
import type {Json, JsonObject, JsonValue} from "~/shared/domain/JsonTypes";

export type CreateAccount = {
	uuid?: string;
	email: string;
	name: string;
	passwordHash: string | undefined;
};
export type Account = CreateAccount & {
	uuid: string;
	emailVerified: boolean;
	passwordHash: string;
	preferences?: JsonObject;
	roles?: string[];
	tokens?: OAuth2Tokens;
};
