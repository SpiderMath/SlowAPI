export default class Argument {
	private _cache: object;

	constructor(params: object) {
		this._cache = params;
	}

	public getString(id: string) {
		// @ts-ignore
		return (this._cache[id] as string);
	}

	public getBoolean(id: string) {
		// @ts-ignore
		return (this._cache[id] as boolean);
	}

	public getNumber(id: string) {
		// @ts-ignore
		return (this._cache[id] as bigint);
	}
};