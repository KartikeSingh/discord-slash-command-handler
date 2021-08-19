const { EventEmitter } = require('events');
const Options = require('./options');
const fs = require("fs")
const ms = require('ms');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { getOptions, getType } = require('../utility');

class Handler extends EventEmitter {
    #slashEventName;
    #slashEvent;
    /**
     * Discord slash command handler ( normal commands also works )
     * @param {Discord.Client} client Provide your discord client
     * @param {Options} options the handler's options
     */
    constructor(client, options) {
        super();
        if (!client || !client.application) throw new Error("Invalid client was provided, only Discord.js V.13 is supporter");
        if (client === true) return;

        this.client = client;
        this.#slashEventName = this.client.application ? "interactionCreate" : "INTERACTION_CREATE";
        this.#slashEvent = this.client.application ? this.client.on : this.client.ws.on;

        this.options = new Options(options);
        this.client.commands = new Map();
        this.client.commandAliases = new Map();
        this.timeouts = new Map();

        if (fs.existsSync(this.options.eventFolder)) this.handleEvents();

        this.setCommands().then(() => {
            this.emit("commandsCreated", this.client.commands, this.client.commandAliases);

            if (this.options.handleSlash === "both" || this.options.handleSlash === true) this.handleSlashCommands();
            if (this.options.handleNormal === true || this.options.handleNormal === "both") this.handleNormalCommands();
        }).catch((e) => {
            console.log("[ Discord-Slash-Command-Handler ] : Error in loading the commands\n" + e);
        })
    }

    async setCommands() {
        return new Promise(async (resolve, reject) => {
            let command;
            try {
                let commands = fs.readdirSync(this.options.commandFolder) ? fs.readdirSync(this.options.commandFolder).filter(file => file.endsWith(".js")) : [], i;

                if (commands.length < 1) reject("no commands");

                let _commands = 0, _slashCommands = 0, _normalCommands = 0;

                for (i = 0; i < commands.length; i++) {
                    command = require(`${this.options.commandFolder}/${commands[i]}`);

                    if (!command.name || !command.run) continue;

                    command.name = command.name.replace(/ /g, "-").toLowerCase();
                    this.client.commands.set(command.name, command);
                    command.aliases ? command.aliases.forEach((v) => this.client.commandAliases.set(v, command.name)) : null;

                    _commands++;

                    if (command.slash !== true) _normalCommands++;

                    if (command.slash === true || command.slash === "both") {

                        if (!command.description) throw new Error("Description is required in a command\n Description was not found in " + command.name)

                        if ((!command.options || command.options.length === 0) && command.args) {
                            command.options = getOptions(command.args, command.argsDescription, command.argsType);
                        } else {
                            if (command.options && command.options.length > 0) {
                                for (let i = 0; i < command.options.length; i++) {
                                    command.options[i].type = getType(command.options[i].type);
                                }
                            }
                        }

                        const command_data = {
                            name: command.name,
                            description: command.description,
                            options: command.options || [],
                            type: 1,
                        }

                        if (!this.client.application) {
                            const app = this.client.api.applications(this.client.user.id);

                            if (this.options.slashGuilds.length > 0 && command.global !== true) {
                                app.guilds(this.slashGuilds);
                            }

                            app.commands.post({
                                data: command_data,
                            })
                        } else {
                            if (command.global) this.client.application.commands.create(command_data);
                            else {
                                const rest = new REST({ version: '9' }).setToken(this.client.token);

                                this.options.slashGuilds.forEach(async v => {
                                    await rest.put(Routes.applicationGuildCommands(this.client.user.id, v), { body: [command_data] })
                                })
                            }
                        }

                        _slashCommands++;
                    }
                }

                console.log(`[Discord-Slash-Command-Handler] : Added ${_commands} Commands, out of which ${_slashCommands} are slash commands and ${_normalCommands} are normal commands\n\nGuild Slash commands will start working in ${this.options.slashGuilds.length} minutes or less\nGlobal Slash commands will start working after 1 hour`);
                resolve("done")
            } catch (e) {
                reject(e)
                // reject(`${command ? `In ${command.name} :` : ""}\n${e}`);
            }
        })
    }

    async handleSlashCommands() {
        this.client.on("interactionCreate", async (interaction) => {
            let command;
            try {
                command = this.client.commands.get(interaction.commandName);

                if (!command) return;

                if (command.ownerOnly && !this.options.owners.includes(interaction.member.user.id)) return this.replyToInteraction(interaction, this.options.notOwnerReply || _options.notOwnerReply);

                if (this.timeouts.get(`${interaction.member.user.id}_${interaction.commandMame}`)) return this.replyToInteraction(interaction, this.options.timeoutMessage || options.timeoutMessage);

                const args = [], guild = this.client.guilds.cache.get(interaction.guildId);
                let channel = guild.channels.cache.get(interaction.channelId);
                const member = guild.members.cache.get(interaction.member.user.id);

                if (interaction.options._hoistedOptions && interaction.options._hoistedOptions.length > 0) interaction.options._hoistedOptions.forEach((v) => args.push(v.value))

                const message = {
                    member: member,
                    author: member.user,
                    client: this.client,
                    guild: guild,
                    channel: channel,
                    interaction: interaction,
                    content: `/${interaction.commandName} ${args.join(" ")}`,
                    createdAt: Date.now()
                };

                const command_data = {
                    client: this.client,
                    guild: guild,
                    channel: channel,
                    interaction: interaction,
                    args: args,
                    member: member,
                    message: message,
                    handler: this
                }

                let allow = command.permissions ? command.permissions.length === 0 : true;

                if (command.permissions) command.permissions.forEach((v) => { if (member.permissions.has(v)) allow = true });

                if (!allow) {
                    if (typeof (command.error) === "function") {
                        command.error("noPermissions", command, message);
                    } else {
                        await this.replyToInteraction(interaction, this.options.permissionReply || _options.permissionReply);
                    }
                    return;
                }

                await this.replyToInteraction(interaction, "command accepted");

                const timeout = (isNaN(command.timeout) && command.timeout) ? ms(command.timeout || " ") : command.timeout || (isNaN(command.cooldown) && command.cooldown) ? ms(command.cooldown || " ") : command.cooldown;

                if (timeout && this.options.timeouts === true) {
                    this.timeouts.set(`${interaction.member.user.id}_${interaction.data.name}`);
                    setTimeout(() => this.timeouts.delete(`${interaction.member.user.id}_${interaction.data.name}`), timeout)
                }

                if (this.options.handleSlash === true) command.run(command_data);
                else this.emit("slashCommand", command, command_data);
            } catch (e) {
                if (typeof (command.error) === "function") {
                    command.error("exception", command, message, e);
                    this.emit("exception", command, message, e);
                } else {
                    await this.replyToInteraction(interaction, this.options.errorReply || _options.errorReply);
                }
            }
        })
    }

    async handleNormalCommands() {
        this.client.on('message', async (message) => {
            let command;
            try {
                if (message.author.bot || !message.content.toLowerCase().startsWith(this.options.prefix)) return;

                const args = message.content.slice(this.options.prefix.length).trim().split(/ +/g) || [];
                let cmd = args.shift().toLowerCase();

                if (cmd.length == 0) return;

                command = this.client.commands.get(cmd) || this.client.commands.get(this.client.commandAliases.get(cmd));

                if (!command || command.slash === true) return;

                if (command.ownerOnly && !this.options.owners.includes(message.author.id)) return message.reply({ content: this.options.notOwnerReply || _options.notOwnerReply });

                if (command.dm === "only" && message.guild) return;
                if (command.dm !== true && !message.guild) return;

                if (this.timeouts.has(`${message.author.id}_${command.name}`)) {
                    if (this.options.handleTimeout !== false) message.reply({ content: this.options.timeoutMessage || _options.timeoutMessage });
                    this.emit("timeout", command, message)
                    if (typeof (command.error) === "function") command.error("timeout", command, message)
                    return;
                }

                const reqArgs = command.args ? getOptions(command.args).filter((v) => v.required === true) || [] : command.options ? command.options.filter(v => v.required === true) : []; 0
                0
                if (args.length < reqArgs.length) {
                    if (typeof (command.error) === "function") {
                        command.error("lessArguments", command, message)
                        this.emit("lessArguments", command, message)
                    } else {
                        message.reply({ content: `Invalid Syntax corrected syntax is : \`${this.options.prefix}${command.name} ${command.args || command.options.reduce((container, next) => { return container + " " + next.name })}\`` });
                        this.emit("lessArguments", command, message)
                    }
                    return;
                }

                let allow = command.permissions && message.guild ? command.permissions.length === 0 : true;

                if (message.guild) if (command.permissions) command.permissions.forEach((v) => { if (message.member.permissions.has(v)) allow = true });

                if (!allow) {
                    if (typeof (command.error) === "function") {
                        command.error("noPermission", command, message);
                        this.emit("noPermission", command, message)
                    } else {
                        message.reply({ content: this.options.permissionReply || _options.permissionReply });
                        this.emit("noPermission", command, message)
                    }
                    return;
                }

                const command_data = {
                    client: this.client,
                    guild: message.guild,
                    channel: message.channel,
                    interaction: undefined,
                    args: args,
                    member: message.member,
                    message: message,
                    handler: this
                }

                let timeout;

                if (command.timeout || command.cooldown) {
                    if (typeof (command.timeout || command.cooldown) === "string") timeout = ms(command.timeout || command.cooldown)
                    else timeout = command.timeout || command.cooldown;
                }

                if (timeout && this.options.timeouts === true) {
                    this.timeouts.set(`${message.author.id}_${command.name}`);
                    setTimeout(() => this.timeouts.delete(`${message.author.id}_${command.name}`), timeout)
                }

                if (this.options.handleNormal === true) command.run(command_data);
                else this.emit("normalCommand", command, command_data);
            } catch (e) {
                this.emit("exception", command, message, e);
                if (typeof (command.error) === "function") command.error("exception", command, message, e);
            }
        })

    }

    async handleEvents() {
        fs.readdirSync(this.options.eventFolder).filter((f) => f.endsWith(".js")).forEach((file) => {
            this.client.on(`${file.substring(0, file.length - 3)}`, (a, b, c, d) => require(`${this.options.eventFolder}/${file}`)(this.client, a, b, c, d));
        });
    }

    async replyToInteraction(interaction, content) {
        try {
            this.client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: content,
                        flags: 64
                    }
                }
            })
        } catch (e) {
            console.log(`[Discord-Slash-Command-Handler] : ${e}`)
        }
    }

    /**
     * Reload all the commands of your bot
     */
    async reloadCommands() {
        await this.client.commands.clear();
        await this.client.commandAliases.clear();

        return new Promise((res, rej) => {
            this.setCommands()
                .then((v) => {
                    res(this.client.commands, this.client.commandAliases)
                    console.log("[discord-slash-command-handler] : Commands are reloaded")
                    this.emit("commandsCreated", this.client.commands, this.client.commandAliases)
                })
                .catch((e) => {
                    rej(e);
                    console.log("[discord-slash-command-handler] : There was a error in reloading the commands")
                })
        })
    }
}


module.exports = Handler;