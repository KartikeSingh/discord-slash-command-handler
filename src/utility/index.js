"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.fixType = function (type) {
        if (type === void 0) { type = 1; }
        if (typeof (type) !== "number" && typeof (type) !== "string")
            throw new Error("Command Type should be a string or a number");
        type = typeof (type) === "string" ? type.toLowerCase() : type;
        if (!type || type > 3 || type < 1 || type === "chat" || type === "chat_input")
            return 1;
        else if (type === "user")
            return 2;
        else if (type === "message")
            return 3;
        else if (typeof (type) === "number")
            return type;
        else
            return 1;
    };
    Utils.getOptions = function (args, argsDescription, argsType) {
        if (args === void 0) { args = ""; }
        if (argsDescription === void 0) { argsDescription = ""; }
        if (argsType === void 0) { argsType = ""; }
        var last = "", lastIndex = 0, index = 0;
        var ArgsDescription = argsDescription.length > 1 ? argsDescription.split("|") : [] || [], ArgsType = argsType.length > 1 ? argsType.split("|") : [] || [];
        var req = [], opt = [];
        for (var i = 0; i < args.length; i++) {
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
    };
    Utils.getType = function (type) {
        try {
            type = typeof (type) === "string" ? type.toUpperCase().trim() : type;
            if (typeof (type) === "number" && type > 0 && type < 9)
                return type;
            if (!type)
                return 3;
            return type === "SUB_COMMAND" ? 1 : type === "SUB_COMMAND_GROUP" ? 2 : type === "STRING" ? 3 : type === "INTEGER" ? 4 : type === "BOOLEAN" ? 5 : type === "USER" ? 6 : type === "CHANNEL" ? 7 : type === "ROLE" ? 8 : 3;
        }
        catch (e) {
            return 3;
        }
    };
    Utils.add = function (commands, extraFolder) {
        var _this = this;
        if (extraFolder === void 0) { extraFolder = ""; }
        return new Promise(function (res) {
            var _a, _b;
            var globalCommands = [], guildCommands = [];
            var _loop_1 = function (i) {
                var command = require("" + _this.options.commandFolder + extraFolder + "/" + commands[i]) || {};
                if (!command.name || !command.run)
                    return "continue";
                command.name = command.name.replace(/ /g, "-").toLowerCase();
                _this.client.commands.set(command.name, command);
                command.aliases ? command.aliases.forEach(function (v) { return _this.client.commandAliases.set(v, command.name); }) : null;
                if (command.slash !== true && command.slash !== "both" && _this.options.allSlash !== true)
                    return "continue";
                if (!command.description)
                    throw new Error("Description is required in a slash command\n Description was not found in " + command.name);
                if ((!command.options || command.options.length === 0) && command.args)
                    command.options = _this.Utils.getOptions(command.args, command.argsDescription, command.argsType);
                else if (command.options && command.options.length > 0) {
                    for (var i_1 = 0; i_1 < command.options.length; i_1++) {
                        command.options[i_1].type = _this.Utils.getType(command.options[i_1].type);
                        command.options[i_1].name = (_b = (_a = command.options[i_1].name) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.replace(/ /g, "-");
                    }
                }
                var command_data = {
                    name: command.name,
                    description: command.description,
                    options: command.options || [],
                    type: _this.Utils.fixType(command.type),
                };
                if (command.global)
                    globalCommands.push(command_data);
                else
                    guildCommands.push(command_data);
            };
            for (var i = 0; i < commands.length; i++) {
                _loop_1(i);
            }
            res({ globalCommands: globalCommands, guildCommands: guildCommands });
        });
    };
    return Utils;
}());
exports.default = Utils;
