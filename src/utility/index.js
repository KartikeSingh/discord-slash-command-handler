"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    // command type
    static fixType(type = 1) {
        if (typeof type !== "number" && typeof type !== "string")
            throw new Error("Command Type should be a string or a number");
        type = typeof type === "string" ? type === null || type === void 0 ? void 0 : type.toLowerCase() : type;
        if (!type || type > 3 || type < 1 || type === "chat" || type === "chat_input")
            return 1;
        else if (type === "user")
            return 2;
        else if (type === "message")
            return 4;
        else if (typeof type === "number")
            return type;
        else
            return 1;
    }
    static getOptions(args = "", argsDescription = "", argsType = "") {
        let last = "", lastIndex = 0, index = 0;
        const ArgsDescription = argsDescription.length > 1 ? argsDescription.split("|") : [] || [], ArgsType = argsType.length > 1 ? argsType.split("|") : [] || [];
        const req = [], opt = [];
        for (let i = 0; i < args.length; i++) {
            if (last === "<" ? args[i] === ">" : args[i] === "]") {
                last === "<" ? req.push({ name: args.substring(lastIndex + 1, i).replace(/ /g, "-").toLowerCase(), required: true, description: ArgsDescription[index] || args.substring(lastIndex + 1, i), type: Utils.getType(ArgsType[index]) || "STRING" }) : opt.push({ name: args.substring(lastIndex + 1, i).replace(/ /g, "-").toLowerCase(), required: false, description: ArgsDescription[index] || args.substring(lastIndex + 1, i), type: Utils.getType(ArgsType[index]) || "STRING" });
                index++;
            }
            if (args[i] === "<" || args[i] === "[") {
                last = args[i];
                lastIndex = i;
            }
        }
        return req.concat(opt);
    }
    // option type
    static getType(type) {
        var _a;
        try {
            type = typeof type === "string" ? (_a = type === null || type === void 0 ? void 0 : type.toUpperCase()) === null || _a === void 0 ? void 0 : _a.trim() : type;
            if (typeof type === "number" && type > 0 && type < 9)
                return type;
            if (!type)
                return 3;
            return type === "SUB_COMMAND" ? 1 : type === "SUB_COMMAND_GROUP" ? 2 : type === "STRING" ? 3 : type === "INTEGER" ? 4 : type === "BOOLEAN" ? 5 : type === "USER" ? 6 : type === "CHANNEL" ? 7 : type === "ROLE" ? 8 : 3;
        }
        catch (e) {
            return 3;
        }
    }
    static fixOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                if (!options || !(options === null || options === void 0 ? void 0 : options.length))
                    return res(undefined);
                for (let i = 0; i < options.length; i++) {
                    options[i].type = this.Utils.getType(options[i].type);
                    options[i].name = (_b = (_a = options[i].name) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.replace(/ /g, "-");
                    if (((_d = (_c = options[i]) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.length) > 0)
                        options[i].options = yield this.Utils.fixOptions.bind(this)((_e = options[i]) === null || _e === void 0 ? void 0 : _e.options);
                }
                res(options);
            }));
        });
    }
    static add(commands, extraFolder = "") {
        return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
            const globalCommands = [], guildCommands = [];
            for (let i = 0; i < commands.length; i++) {
                const command = require(`${this.options.commandFolder}${extraFolder}/${commands[i]}`) || {};
                if (!command.name || !command.run)
                    continue;
                if (Utils.fixType(command.type) !== 1)
                    command.name = command.name.replace(/ /g, "-").toLowerCase();
                if (Utils.fixType(command.type) !== 1)
                    command.description = "";
                this.client.commands.set(command.name, command);
                command.aliases ? command.aliases.forEach((v) => this.client.commandAliases.set(v, command.name)) : null;
                if (command.slash !== true && command.slash !== "both" && this.options.allSlash !== true)
                    continue;
                if (!command.description)
                    throw new Error("Description is required in a slash command\n Description was not found in " + command.name);
                if ((!command.options || command.options && command.options.length < 1) && command.args)
                    command.options = this.Utils.getOptions(command.args, command.argsDescription, command.argsType);
                command.options = yield this.Utils.fixOptions.bind(this)(command.options);
                const command_data = {
                    name: command.name,
                    description: command.description,
                    options: command.options || [],
                    type: this.Utils.fixType(command.type),
                };
                if (command.guildOnly)
                    guildCommands.push(command_data);
                else
                    globalCommands.push(command_data);
            }
            res({ globalCommands, guildCommands });
        }));
    }
    static getParameters(keys, values, runParameters) {
        const parameters = [];
        runParameters.forEach(v => {
            const data = {};
            if (v.includes("0")) {
                for (let i = 0; i < 10; i++) {
                    if (values[i.toString()])
                        data[keys[i.toString()]] = values[i.toString()];
                }
                parameters.push(data);
            }
            else if (v.length === 1) {
                if (values[v])
                    parameters.push(values[v]);
            }
            else {
                const V = v.split(""), data = {};
                V.forEach(i => {
                    if (values[i.toString()])
                        data[keys[i.toString()]] = values[i.toString()];
                });
                if (Object.keys(data).length > 0)
                    parameters.push(data);
            }
        });
        return parameters;
    }
    static replyInteraction(interaction, message) {
        try {
            if (interaction.replied)
                interaction.followUp(message);
            else
                interaction.reply(message);
        }
        catch (e) {
            interaction.channel.send(`${interaction.user.toString()}, ${message}`);
        }
    }
}
exports.default = Utils;
