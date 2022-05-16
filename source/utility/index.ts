import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, Interaction, MessageComponentInteraction, SelectMenuInteraction } from "discord.js";
import Handler from "../classes/handler";
import { Command, Options } from "../interfaces";

class Utils {
    // command type
    static fixType(type: string | number = 1): number {
        if (typeof type !== "number" && typeof type !== "string") throw new Error("Command Type should be a string or a number");

        type = typeof type === "string" ? type?.toLowerCase() : type;

        if (!type || type > 3 || type < 1 || type === "chat" || type === "chat_input") return 1;
        else if (type === "user") return 2;
        else if (type === "message") return 4;
        else if (typeof type === "number") return type;
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

    // option type
    static getType(type: string | number) {
        try {
            type = typeof type === "string" ? type?.toUpperCase()?.trim() : type;

            if (typeof type === "number" && type > 0 && type < 9) return type;
            if (!type) return 3;

            return type === "SUB_COMMAND" ? 1 : type === "SUB_COMMAND_GROUP" ? 2 : type === "STRING" ? 3 : type === "INTEGER" ? 4 : type === "BOOLEAN" ? 5 : type === "USER" ? 6 : type === "CHANNEL" ? 7 : type === "ROLE" ? 8 : 3;
        } catch (e) {
            return 3;
        }
    }

    static async fixOptions(this: Handler, options: Options[]) {
        return new Promise(async (res) => {
            if (!options || !options?.length) return res(undefined);

            for (let i = 0; i < options.length; i++) {
                options[i].type = this.Utils.getType(options[i].type);
                options[i].name = options[i].name?.trim()?.replace(/ /g, "-");

                if (options[i]?.options?.length > 0) options[i].options = await this.Utils.fixOptions.bind(this)(options[i]?.options);
            }
            res(options);
        })
    }

    static add(this: Handler, commands: string[], extraFolder: string = "") {
        return new Promise(async (res) => {
            const globalCommands = [], guildCommands = [];
            for (let i = 0; i < commands.length; i++) {
                const command: Command = require(`${this.options.commandFolder}${extraFolder}/${commands[i]}`) || {};

                if (!command.name || !command.run) continue;

                if (Utils.fixType(command.type) !== 1) command.name = command.name.replace(/ /g, "-").toLowerCase();
                if (Utils.fixType(command.type) !== 1) command.description = "";

                this.client.commands.set(command.name, command);

                command.aliases ? command.aliases.forEach((v) => this.client.commandAliases.set(v, command.name)) : null;

                if (command.slash !== true && command.slash !== "both" && this.options.allSlash !== true) continue;

                if (!command.description) throw new Error("Description is required in a slash command\n Description was not found in " + command.name)

                if ((!command.options || command.options && command.options.length < 1) && command.args) command.options = this.Utils.getOptions(command.args, command.argsDescription, command.argsType);

                command.options = await this.Utils.fixOptions.bind(this)(command.options);

                const command_data = {
                    name: command.name,
                    description: command.description,
                    options: command.options || [],
                    type: this.Utils.fixType(command.type),
                }

                if (command.guildOnly) guildCommands.push(command_data);
                else globalCommands.push(command_data);
            }

            res({ globalCommands, guildCommands });
        })
    }

    static getParameters(keys: any, values: any, runParameters: string[]): Array<any> {
        const parameters = [];

        runParameters.forEach(v => {
            const data = {};
            if (v.includes("0")) {
                for (let i = 0; i < 10; i++) {
                    if (values[i.toString()]) data[keys[i.toString()]] = values[i.toString()];
                }

                parameters.push(data);
            } else if (v.length === 1) {
                if (values[v]) parameters.push(values[v]);
            } else {
                const V = v.split(""), data = {};

                V.forEach(i => {
                    if (values[i.toString()]) data[keys[i.toString()]] = values[i.toString()];
                })

                if (Object.keys(data).length > 0) parameters.push(data)
            }
        })

        return parameters;
    }

    static replyInteraction(interaction: CommandInteraction | ContextMenuInteraction | MessageComponentInteraction | ButtonInteraction | SelectMenuInteraction, message: string) {
        try {
            if (interaction.replied) interaction.followUp(message);
            else interaction.reply(message);
        } catch (e) {
            interaction.channel.send(`${interaction.user.toString()}, ${message}`);
        }
    }
}

export default Utils;