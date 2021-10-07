import { CommandInteraction, ContextMenuInteraction, Guild } from "discord.js";
import Client from "../classes/Client";
import Handler from "../classes/handler";

class Utils {
    static fixType(type: string | number = 1) {
        if (typeof (type) !== "number" && typeof (type) !== "string") throw new Error("Command Type should be a string or a number");

        type = typeof (type) === "string" ? type.toLowerCase() : type;

        if (!type || type > 3 || type < 1 || type === "chat" || type === "chat_input") return 1;
        else if (type === "user") return 2;
        else if (type === "message") return 3;
        else if (typeof (type) === "number") return type;
        else return 1;
    }

    static getOptions(args: string = "", argsDescription: string = "", argsType: string = "") {
        let last = "", lastIndex = 0, index = 0;

        const ArgsDescription: string[] = argsDescription.length > 1 ? argsDescription.split("|") : [] || [], ArgsType: string[] = argsType.length > 1 ? argsType.split("|") : [] || [];

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

    static getType(type: string | number) {
        try {
            type = typeof (type) === "string" ? type.toUpperCase().trim() : type;

            if (typeof (type) === "number" && type > 0 && type < 9) return type;
            if (!type) return 3;

            return type === "SUB_COMMAND" ? 1 : type === "SUB_COMMAND_GROUP" ? 2 : type === "STRING" ? 3 : type === "INTEGER" ? 4 : type === "BOOLEAN" ? 5 : type === "USER" ? 6 : type === "CHANNEL" ? 7 : type === "ROLE" ? 8 : 3;
        } catch (e) {
            return 3;
        }
    }

    static add(this: Handler, commands: string[], extraFolder: string = "") {
        return new Promise((res) => {
            const globalCommands = [], guildCommands = [];
            for (let i = 0; i < commands.length; i++) {
                const command = require(`${this.options.commandFolder}${extraFolder}/${commands[i]}`) || {};

                if (!command.name || !command.run) continue;

                command.name = command.name.replace(/ /g, "-").toLowerCase();
                this.client.commands.set(command.name, command);

                command.aliases ? command.aliases.forEach((v) => this.client.commandAliases.set(v, command.name)) : null;

                if (command.slash !== true && command.slash !== "both" && this.options.allSlash !== true) continue;

                if (!command.description) throw new Error("Description is required in a slash command\n Description was not found in " + command.name)

                if ((!command.options || command.options.length === 0) && command.args) command.options = this.Utils.getOptions(command.args, command.argsDescription, command.argsType);
                else if (command.options && command.options.length > 0) {
                    for (let i = 0; i < command.options.length; i++) {
                        command.options[i].type = this.Utils.getType(command.options[i].type);
                        command.options[i].name = command.options[i].name?.trim()?.replace(/ /g, "-")
                    }
                }

                const command_data = {
                    name: command.name,
                    description: command.description,
                    options: command.options || [],
                    type: this.Utils.fixType(command.type),
                }

                if (command.global) globalCommands.push(command_data)
                else guildCommands.push(command_data);
            }

            res({ globalCommands, guildCommands });
        })
    }
}

export default Utils;