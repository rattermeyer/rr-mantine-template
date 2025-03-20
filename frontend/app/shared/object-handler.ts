export function filterNonNullAttributes<T extends object>(
	source: T,
): Partial<T> {
	const result: Partial<T> = {};
	for (const key in source) {
		if (source[key] !== null) {
			result[key] = source[key];
		}
	}
	return result;
}
