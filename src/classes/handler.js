const Options = require('./options');
const ARGS = require('./args');
const fs = require("fs")
const ms = require('ms-prettify');
const Discord = require('discord.js');
const Timeout = require('./timeout');
const { EventEmitter } = require('events');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getOptions, getType, modifyInteraction } = require('../utility');

class Handler extends EventEmitter {
    /**
     * Discord slash command handler ( normal commands also works )
     * @param {Discord.Client} client Provide your discord client
     * @param {Options} options the handler's options
     */
    constructor(client, options) {
        super();
        if (client === true) return;
        if (!client || !client.application) throw new Error("Invalid client was provided, Note Client should be provided in ready event");

        this.client = client;
        this.options = new Options(options);
        this.Timeout = new Timeout(this.client, this.options.mongoURI || "no_uri");
        this.client.commands = new Discord.Collection();
        this.client.commandAliases = new Discord.Collection();

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
            let command, globalCommands = [], guildCommands = [];
            try {
                let commands_ = fs.readdirSync(this.options.commandFolder)?.filter(file => this.options.commandType === "file" ? file.endsWith(".js") : fs.statSync(`${this.options.commandFolder}/${file}`).isDirectory()), i;

                if (commands_.length === 0) return reject("No Folders/file in the provided location");

                let _commands = 0, _slashCommands = 0, _normalCommands = 0;

                if (this.options.commandType === "file") await add.bind(this)(commands_);
                else {
                    for (let i = 0; i < commands_.length; i++) {
                        await add.bind(this)(fs.readdirSync(`${this.options.commandFolder}/${commands_[i]}`).filter(file => file.endsWith(".js")), `/${commands_[i]}`);
                    }
                }

                function add(commands, ex = "") {
                    return new Promise((res) => {
                        for (i = 0; i < commands.length; i++) {
                            command = require(`${this.options.commandFolder}${ex}/${commands[i]}`) || {};

                            if (!command.name || !command.run) continue;

                            command.name = command.name.replace(/ /g, "-").toLowerCase();
                            this.client.commands.set(command.name, command);
                            command.aliases ? command.aliases.forEach((v) => this.client.commandAliases.set(v, command.name)) : null;

                            _commands++;

                            if (command.slash !== true) _normalCommands++;
                            if (command.slash !== true && command.slash !== "both" && this.options.allSlash !== true) continue;

                            _slashCommands++;

                            if (!command.description) throw new Error("Description is required in a command\n Description was not found in " + command.name)

                            if ((!command.options || command.options.length === 0) && command.args) command.options = getOptions(command.args, command.argsDescription, command.argsType);
                            else if (command.options && command.options.length > 0) {
                                for (let i = 0; i < command.options.length; i++) {
                                    command.options[i].type = getType(command.options[i].type);
                                    command.options[i].name = command.options[i].name?.trim()?.replace(/ /g, "-")
                                }
                            }

                            const command_data = {
                                name: command.name,
                                description: command.description,
                                options: command.options || [],
                                type: 1,
                            }

                            if (command.global) globalCommands.push(command_data)
                            else guildCommands.push(command_data);
                        }

                        res();
                    })
                }

                const rest = new REST({ version: '9' }).setToken(this.client.token);

                if (globalCommands.length > 0) rest.put(Routes.applicationCommands(this.client.user.id), { body: globalCommands })

                if (this.options.slashGuilds.length > 0 && guildCommands.length > 0) this.options.slashGuilds.forEach(v => rest.put(Routes.applicationGuildCommands(this.client.user.id, v), { body: guildCommands }))

                console.log(`[ discord-Slash-Command-Handler ] : Added ${_commands} Commands, out of which ${_slashCommands} are slash commands and ${_normalCommands} are normal commands\n\nGuild Slash commands will start working in ${this.options.slashGuilds.length} minutes or less\nGlobal Slash commands will start working after 1 hour`);
                resolve("done")
            } catch (e) {
                reject(e + `\nin command : ${command?.name || "none"}`)
            }
        })
    }

    async handleSlashCommands() {
        this.client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) return;

            let command;
            const guild = await this.client.guilds.cache.get(interaction.guildId).fetch(), member = guild.members.cache.get(interaction.user.id);

            const message = modifyInteraction(this.client, interaction, guild);
            try {
                command = this.client.commands.get(interaction.commandName);

                if (!command) return;

                if (command.dm === "only" && message.guild) return;
                if (command.dm !== true && !message.guild) return;

                if (command.ownerOnly && !this.options.owners.includes(interaction.user.id)) {
                    if (typeof (command.error) === "function") command.error("notOwner", command, message);
                    else if (this.listeners("notOwner").length > 0) this.emit("notOwner", command, message);
                    else this.replyToInteraction(interaction, this.options.notOwnerReply);

                    return;
                }

                const tm = await this.Timeout.getTimeout(interaction.user.id, interaction.commandName);

                if (tm.at > Date.now()) {
                    if (typeof (command.error) === "function") command.error("timeout", command, message)
                    else if (this.listeners("timeout").length > 0) this.emit("timeout", command, message);
                    else this.replyToInteraction(interaction, this.options.timeoutMessage.replace(/{remaining}/g, ms(tm.at - Date.now())).replace(/{mention}/g, interaction.user.toString()).replace(/{command}/g, command.name))

                    return;
                }

                const args = new ARGS(interaction?.options?._hoistedOptions || []);

                const channel = await guild.channels.fetch(interaction.channelId, { cache: true, force: true })
                const command_data = {
                    client: this.client,
                    guild,
                    channel,
                    interaction,
                    args,
                    member,
                    user: member.user,
                    message,
                    handler: this,
                    subCommand: interaction.options._subcommand,
                    subCommandGroup: interaction.options._group,
                }

                let allow = command.permissions ? command.permissions.length === 0 : true;

                if (command.permissions) command.permissions.forEach((v) => { if (member.permissions.has(v)) allow = true });

                if (!allow) {
                    if (typeof (command.error) === "function") command.error("noPermissions", command, message);
                    else if (this.listeners("noPermissions").length > 0) this.emit("noPermissions", command, message)
                    else this.replyToInteraction(interaction, this.options.permissionReply.replace(/{mention}/g, interaction.user.toString()).replace(/{command}/g, command.name));

                    return;
                }

                this.replyToInteraction(interaction, "command accepted");

                let timeout;

                if (command.timeout || command.cooldown) {
                    if (typeof (command.timeout || command.cooldown) === "string") timeout = ms(command.timeout || command.cooldown)
                    else timeout = command.timeout || command.cooldown;
                }

                if (timeout && this.options.timeout === true) this.Timeout.setTimeout(interaction.user.id, command.name, Date.now() + timeout);

                if (this.options.handleSlash === true) command.run(command_data);
                else this.emit("slashCommand", command, command_data);
            } catch (e) {
                if (typeof (command.error) === "function") command.error("exception", command, message, e);
                else if (this.listeners("exception").length > 0) this.emit("exception", command, message, e);
                else this.replyToInteraction(interaction, this.options.errorReply || _options.errorReply);

                return;
            }
        })
    }

    async handleNormalCommands() {
        this.client.on('messageCreate', async (message) => {
            let command;
            try {
                if (message.author.bot || !message.content.toLowerCase().startsWith(this.options.prefix)) return;

                const args = message.content.slice(this.options.prefix.length).trim().split(/ +/g) || [];
                let cmd = args.shift().toLowerCase();

                if (cmd.length == 0) return;

                command = this.client.commands.get(cmd) || this.client.commands.get(this.client.commandAliases.get(cmd));

                if (!command || command.slash === true) return;

                if (command.ownerOnly && !this.options.owners.includes(message.author.id)) {
                    if (typeof (command.error) === "function") command.error("notOwner", command, message);
                    else if (this.listeners("notOwner").length > 0) this.emit("notOwner", command, message);
                    else this.replyToInteraction(interaction, this.options.notOwnerReply);

                    return;
                }

                if (command.dm === "only" && message.guild) return;
                if (command.dm !== true && !message.guild) return;

                const tm = await this.Timeout.getTimeout(message.author.id, command.name);

                if (tm.at > Date.now()) {
                    if (typeof (command.error) === "function") command.error("timeout", command, message)
                    else if (this.listeners("timeout").length > 0) this.emit("timeout", command, message);
                    else message.reply(this.options.timeoutMessage.replace(/{mention}/g, message.author.toString()).replace(/{remaining}/g, ms(tm.at - Date.now())).replace(/{command}/g, command.name))

                    return;
                }

                const reqArgs = command.args ? getOptions(command.args).filter((v) => v.required === true) || [] : command.options ? command.options.filter(v => v.required === true) : []; 0

                if (args.length < reqArgs.length) {
                    if (typeof (command.error) === "function") command.error("lessArguments", command, message)
                    else if (this.listeners("lessArguments").length > 0) this.emit("lessArguments", command, message)
                    else message.reply({ content: `Invalid Syntax corrected syntax is : \`${this.options.prefix}${command.name} ${command.args || command.options.reduce((container, next) => { return container + " " + next.name }) || " "}\`` });

                    return;
                }

                let allow = command.permissions && message.guild ? command.permissions.length === 0 : true;

                if (message.guild) if (command.permissions) command.permissions.forEach((v) => { if (message.member.permissions.has(v)) allow = true });

                if (!allow) {
                    if (typeof (command.error) === "function") command.error("noPermissions", command, message);
                    else if (this.listeners("noPermissions").length > 0) this.emit("noPermissions", command, message)
                    else this.replyToInteraction(interaction, this.options.permissionReply.replace(/{mention}/g, interaction.user.toString()).replace(/{command}/g, command.name));

                    return;
                }

                const command_data = {
                    client: this.client,
                    guild: message.guild,
                    channel: message.channel,
                    interaction: undefined,
                    args: new ARGS(args),
                    member: message.member,
                    message: message,
                    handler: this,
                    user: message.author
                }

                let timeout;

                if (command.timeout || command.cooldown) {
                    if (typeof (command.timeout || command.cooldown) === "string") timeout = ms(command.timeout || command.cooldown)
                    else timeout = command.timeout || command.cooldown;
                }

                if (timeout && this.options.timeout === true) {
                    this.Timeout.setTimeout(message.author.id, command.name, Date.now() + timeout);
                }

                if (this.options.handleNormal === true) command.run(command_data);
                else this.emit("normalCommand", command, command_data);
            } catch (e) {
                if (typeof (command.error) === "function") command.error("exception", command, message, e);
                else if (this.listeners("exception").length > 0) this.emit("exception", command, message, e);
                else message.reply(this.options.errorReply);

                return;
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
            console.log(`[ discord-Slash-Command-Handler ] : ${e}`)
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
                    console.log("[ discord-slash-command-handler ] : Commands are reloaded")
                    this.emit("commandsCreated", this.client.commands, this.client.commandAliases)
                })
                .catch((e) => {
                    rej(e);
                    console.log("[ discord-slash-command-handler ] : There was a error in reloading the commands");
                    console.log(e);
                })
        })
    }

    /**
     * 
     * @param { "commandsCreated" | "slashCommand" | "normalCommand" | "lessArguments" | "noPermission" | "timeout" | "notOwner" | "exception"} event 
     * @param {function} _function The callback function, for arguments check docs
     */
    on(event, _function) {
        super.on(event, _function)
    }
}

module.exports = Handler;