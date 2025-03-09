export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
	[x: string]: JsonValue | undefined;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export function jsonToRecord(json: JsonObject): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key in json) {
        if (Object.hasOwn(json, key)) {
            const value = json[key];
            if (typeof value === 'string') {
                result[key] = value;
            } else if (value !== undefined && value !== null) {
                result[key] = JSON.stringify(value);
            }
        }
    }
    return result;
}
