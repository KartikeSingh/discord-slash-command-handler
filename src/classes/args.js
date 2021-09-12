class args extends Array {
    #collection;
    #array;

    /**
     * 
     * @param {Array<String> | Array<arg>} args The arguments.
     */
    constructor(args = []) {
        if (!Array.isArray(args)) return;
        let newArgs = [];

        args.forEach(v => newArgs.push(v.value ? v.value : v));

        super(newArgs.length === 0 ? undefined : newArgs);

        this.#collection = new Map();
        this.#array = newArgs;

        args.forEach((v, i) => {
            this[i] = typeof (v) !== "string" ? v.value : v;

            if (v.value) {
                this.#collection.set(v.name, v.value);
                this[v.name] = v.value;
            }
        });
    }

    /**
     * Get any argument.
     * @param {String | Number} name Name of the argument or Index you want.
     * @exports value The value of the argument, undefined if not found.
     */
    get(name) {
        if (typeof (name) === "number") return this.#array[name];
        else if (typeof (name) === "string") return this.#collection.get(name) || this[name];
        else return undefined;
    }

    toArray() {
        return this.#array;
    }

    toMap() {
        return this.#collection;
    }
}

module.exports = args;