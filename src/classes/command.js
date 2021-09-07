const { getOptions } = require("../utility");
const _Options = require("./commandOptions");
const Options = new _Options(true);

class command {
    /**
     * 
     * @param {String} name The name of the command
     * @param {String} description The description of the command
     * @param {Array<String>} aliases The aliases of the command
     * @param {String} category The catgory Command belongs to
     * @param {"true" | "false" | "both"} slash Wether the command is an slash command
     * @param {Boolean} global Wether the SLASH command works globally
     * @param {Boolean} ownerOnly Wether the command can only be accessed by the owner of the client
     * @param {Boolean} dm Wether the command can only be accessed by the owner of the client
     * @param {Number} timeout The cooldown for the command in milliseconds
     * @param {String} args The arguments for a command
     * @param {String} argsType The argument type used for slash command
     * @param {String} argsDescription The argument description used for slash command
     * @param {Array<Options>} options The array of options for slash commands
     */
    constructor(name = undefined, description = "No description was provided", aliases = [], category = "none", slash = false, global = false, ownerOnly = false, timeout = 0, args, argsType, argsDescription, options) {
        if (!name) throw new Error("No name was provided for this command");

        this.name = name;
        this.description = description;
        this.aliases = aliases;
        this.category = category;
        this.slash = slash == "true" ? true : slash == "false" ? false : "both";
        this.global = global;
        this.ownerOnly = ownerOnly;
        this.timeout = timeout;

        if (options && options.length > 0) this.options = options;
        else options = getOptions(args, argsDescription, argsType);

        args = "";

        options.forEach((v) => {
            if (v.required) args += `<${v.name}> `;
            else args += `[${v.name}] `;
        })

        this.args = args;
    }
}

module.exports = command;