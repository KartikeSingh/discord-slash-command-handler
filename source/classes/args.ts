class args extends Array {
    private _collection: Map<string | number, any>;

    constructor(args: Array<any> | undefined) {
        super();

        this._collection = new Map();

        args?.forEach(v => {
            this.push(v.value ? v.value : v);

            if (v.name) {
                this._collection.set(v.name, v.value);
                this[v.name] = v.value;
            }
        });
    }

    get(key: string | number): String | Number | Boolean | undefined {
        return this._collection.get(key) || this[key];
    }

    toArray(): args {
        return this;
    }

    toMap(): Map<string | number, any> {
        return this._collection;
    }
}

export default args;