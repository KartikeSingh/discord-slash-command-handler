"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var events_1 = require("events");
var fs_1 = require("fs");
var utility_1 = require("../utility");
var options_1 = require("./options");
var timeout_1 = require("./timeout");
var Message_1 = require("./Message");
var ms_prettify_1 = require("ms-prettify");
var args_1 = require("./args");
var Handler = /** @class */ (function (_super) {
    __extends(Handler, _super);
    function Handler(client, options) {
        if (options === void 0) { options = { commandFolder: "gvyuhubhkjoii-0jiopk[lpmo[pl-o=" }; }
        var _this = _super.call(this) || this;
        _this.Utils = utility_1.default;
        _this.client = client;
        _this.client.commands = new discord_js_1.Collection();
        _this.client.commandAliases = new discord_js_1.Collection();
        _this.options = new options_1.default(options);
        _this.Timeout = new timeout_1.default(_this.client, _this.options.mongoURI);
        _this.client.commands = new discord_js_1.Collection();
        _this.client.commandAliases = new discord_js_1.Collection();
        return _this;
    }
    Handler.prototype.setCommands = function () {
        var _this = this;
        var globalCommands = [], guildCommands = [];
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var Commands, i, data, i_1, data;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        Commands = (_a = (0, fs_1.readdirSync)(this.options.commandFolder)) === null || _a === void 0 ? void 0 : _a.filter(function (file) { return _this.options.commandType === "file" ? file.endsWith(".ts") || file.endsWith(".js") : (0, fs_1.statSync)(_this.options.commandFolder + "/" + file).isDirectory(); });
                        if (Commands.length === 0)
                            return [2 /*return*/, reject("No Folders/file in the provided location")];
                        if (!(this.options.commandType === "file")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.Utils.add.bind(this)(Commands)];
                    case 1:
                        data = _b.sent();
                        globalCommands.push.apply(globalCommands, data.globalCommands);
                        guildCommands.push.apply(guildCommands, data.guildCommands);
                        return [3 /*break*/, 6];
                    case 2:
                        i_1 = 0;
                        _b.label = 3;
                    case 3:
                        if (!(i_1 < Commands.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.Utils.add.bind(this)((0, fs_1.readdirSync)(this.options.commandFolder + "/" + Commands[i_1]).filter(function (file) { return file.endsWith(".ts") || file.endsWith(".js"); }), "/" + Commands[i_1])];
                    case 4:
                        data = _b.sent();
                        globalCommands.push.apply(globalCommands, data.globalCommands);
                        guildCommands.push.apply(guildCommands, data.guildCommands);
                        _b.label = 5;
                    case 5:
                        i_1++;
                        return [3 /*break*/, 3];
                    case 6:
                        resolve({ commands: this.client.commands, commandAliases: this.client.commandAliases });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Handler.prototype.handleSlashCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.client.on("interactionCreate", function (interaction) { return __awaiter(_this, void 0, void 0, function () {
                    var command, message, member, tm, remaining, args, command_data, allow_1, timeout, e_1;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(interaction instanceof discord_js_1.CommandInteraction) && !(interaction instanceof discord_js_1.ContextMenuInteraction))
                                    return [2 /*return*/];
                                command = this.client.commands.get(interaction.commandName), message = new Message_1.default(this.client, interaction, interaction.guild), member = interaction.guild.members.cache.get(interaction.user.id);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                if (command.dm !== true && !interaction.guild) {
                                    if (typeof (command.error) === "function")
                                        command.error("guildOnly", command, message);
                                    else if (this.listeners("guildOnly").length > 0)
                                        this.emit("guildOnly", command, message);
                                    else
                                        interaction.reply(this.options.guildOnlyReply.replace(/{mention}/g, message.author.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                if (command.dm === "only" && interaction.guild) {
                                    if (typeof (command.error) === "function")
                                        command.error("dmOnly", command, message);
                                    else if (this.listeners("dmOnly").length > 0)
                                        this.emit("dmOnly", command, message);
                                    else
                                        interaction.reply(this.options.dmOnlyReply.replace(/{mention}/g, message.author.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                if (command.ownerOnly && !this.options.owners.includes(interaction.user.id)) {
                                    if (typeof (command.error) === "function")
                                        command.error("notOwner", command, message);
                                    else if (this.listeners("notOwner").length > 0)
                                        this.emit("notOwner", command, message);
                                    else
                                        interaction.reply(this.options.notOwnerReply.replace(/{mention}/g, message.author.toString()));
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, this.Timeout.getTimeout(interaction.user.id, interaction.commandName)];
                            case 2:
                                tm = _b.sent();
                                if (tm.from > Date.now()) {
                                    remaining = (0, ms_prettify_1.default)(tm.from - Date.now());
                                    if (typeof (command.error) === "function")
                                        command.error("timeout", command, message);
                                    else if (this.listeners("timeout").length > 0)
                                        this.emit("timeout", command, message);
                                    else
                                        interaction.reply(this.options.timeoutMessage.replace(/{remaining}/g, remaining).replace(/{mention}/g, interaction.user.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                args = new args_1.default(__spreadArray([], (_a = interaction === null || interaction === void 0 ? void 0 : interaction.options) === null || _a === void 0 ? void 0 : _a.data, true) || []);
                                command_data = {
                                    client: this.client,
                                    guild: interaction.guild,
                                    channel: interaction.channel,
                                    interaction: message,
                                    args: args,
                                    member: interaction.member,
                                    user: interaction.member.user,
                                    message: message,
                                    handler: this,
                                    subCommand: interaction.options.getSubcommand(),
                                    subCommandGroup: interaction.options.getSubcommandGroup(),
                                };
                                allow_1 = command.permissions ? command.permissions.length === 0 : true;
                                // @ts-ignore
                                if (command.permissions)
                                    command.permissions.forEach(function (v) { if (member.permissions.has(v))
                                        allow_1 = true; });
                                if (!allow_1) {
                                    if (typeof (command.error) === "function")
                                        command.error("noPermissions", command, message);
                                    else if (this.listeners("noPermissions").length > 0)
                                        this.emit("noPermissions", command, message);
                                    else
                                        interaction.reply(this.options.permissionReply.replace(/{mention}/g, interaction.user.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                interaction.deferReply();
                                timeout = void 0;
                                if (command.timeout) {
                                    if (typeof (command.timeout) === "string")
                                        timeout = (0, ms_prettify_1.default)(command.timeout);
                                    else
                                        timeout = command.timeout;
                                }
                                if (timeout && this.options.timeout === true)
                                    this.Timeout.setTimeout(interaction.user.id, command.name, Date.now() + timeout);
                                // @ts-ignore
                                if (this.options.handleSlash === true)
                                    command.run(command_data);
                                else
                                    this.emit("slashCommand", command, command_data);
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _b.sent();
                                if (typeof (command.error) === "function")
                                    command.error("exception", command, message, e_1);
                                else if (this.listeners("exception").length > 0)
                                    this.emit("exception", command, message, e_1);
                                else
                                    interaction.reply(this.options.errorReply);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Handler.prototype.handleNormalCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.client.on('messageCreate', function (message) { return __awaiter(_this, void 0, void 0, function () {
                    var command, args, cmd, tm, reqArgs, args_2, allow_2, command_data, timeout, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                if (message.author.bot || !message.content.toLowerCase().startsWith(this.options.prefix))
                                    return [2 /*return*/];
                                args = message.content.slice(this.options.prefix.length).trim().split(/ +/g) || [];
                                cmd = args.shift().toLowerCase();
                                if (cmd.length == 0)
                                    return [2 /*return*/];
                                command = this.client.commands.get(cmd) || this.client.commands.get(this.client.commandAliases.get(cmd));
                                if (!command || command.slash === true)
                                    return [2 /*return*/];
                                if (command.ownerOnly && !this.options.owners.includes(message.author.id)) {
                                    if (typeof (command.error) === "function")
                                        command.error("notOwner", command, message);
                                    else if (this.listeners("notOwner").length > 0)
                                        this.emit("notOwner", command, message);
                                    else
                                        message.reply(this.options.notOwnerReply.replace(/{mention}/g, message.author.toString()));
                                    return [2 /*return*/];
                                }
                                if (command.dm !== true && !message.guild) {
                                    if (typeof (command.error) === "function")
                                        command.error("guildOnly", command, message);
                                    else if (this.listeners("guildOnly").length > 0)
                                        this.emit("guildOnly", command, message);
                                    else
                                        message.reply(this.options.guildOnlyReply.replace(/{mention}/g, message.author.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                if (command.dm === "only" && message.guild) {
                                    if (typeof (command.error) === "function")
                                        command.error("dmOnly", command, message);
                                    else if (this.listeners("dmOnly").length > 0)
                                        this.emit("dmOnly", command, message);
                                    else
                                        message.reply(this.options.dmOnlyReply.replace(/{mention}/g, message.author.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, this.Timeout.getTimeout(message.author.id, command.name)];
                            case 1:
                                tm = _a.sent();
                                if (tm.from > Date.now()) {
                                    if (typeof (command.error) === "function")
                                        command.error("timeout", command, message);
                                    else if (this.listeners("timeout").length > 0)
                                        this.emit("timeout", command, message);
                                    else
                                        message.reply(this.options.timeoutMessage.replace(/{mention}/g, message.author.toString()).replace(/{remaining}/g, (0, ms_prettify_1.default)(tm.from - Date.now())).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                reqArgs = command.args ? this.Utils.getOptions(command.args).filter(function (v) { return v.required === true; }) || [] : command.options ? command.options.filter(function (v) { return v.required === true; }) : [];
                                0;
                                if (args.length < reqArgs.length) {
                                    args_2 = command.args || "";
                                    if (args_2 === "" && command.options.length > 0)
                                        command.options.forEach(function (v) { return args_2 += v.required ? "<" + v.name + ">" : "[" + v.name + "]"; });
                                    if (typeof (command.error) === "function")
                                        command.error("lessArguments", command, message);
                                    else if (this.listeners("lessArguments").length > 0)
                                        this.emit("lessArguments", command, message);
                                    else
                                        message.reply({ content: "Invalid Syntax corrected syntax is : `" + this.options.prefix + command.name + " " + args_2 + "`" });
                                    return [2 /*return*/];
                                }
                                allow_2 = command.permissions && message.guild ? command.permissions.length === 0 : true;
                                // @ts-ignore
                                if (message.guild)
                                    if (command.permissions)
                                        command.permissions.forEach(function (v) { if (message.member.permissions.has(v))
                                            allow_2 = true; });
                                if (!allow_2) {
                                    if (typeof (command.error) === "function")
                                        command.error("noPermissions", command, message);
                                    else if (this.listeners("noPermissions").length > 0)
                                        this.emit("noPermissions", command, message);
                                    else
                                        message.reply(this.options.permissionReply.replace(/{mention}/g, message.author.toString()).replace(/{command}/g, command.name));
                                    return [2 /*return*/];
                                }
                                command_data = {
                                    client: this.client,
                                    guild: message.guild,
                                    channel: message.channel,
                                    interaction: undefined,
                                    args: new args_1.default(args),
                                    member: message.member,
                                    message: message,
                                    handler: this,
                                    user: message.author
                                };
                                timeout = void 0;
                                if (command.timeout) {
                                    if (typeof (command.timeout) === "string")
                                        timeout = (0, ms_prettify_1.default)(command.timeout);
                                    else
                                        timeout = command.timeout;
                                }
                                if (timeout && this.options.timeout === true) {
                                    this.Timeout.setTimeout(message.author.id, command.name, Date.now() + timeout);
                                }
                                if (this.options.handleNormal === true)
                                    command.run(command_data);
                                else
                                    this.emit("normalCommand", command, command_data);
                                return [3 /*break*/, 3];
                            case 2:
                                e_2 = _a.sent();
                                if (typeof (command.error) === "function")
                                    command.error("exception", command, message, e_2);
                                else if (this.listeners("exception").length > 0)
                                    this.emit("exception", command, message, e_2);
                                else
                                    message.reply(this.options.errorReply);
                                return [2 /*return*/];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    Handler.prototype.handleEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                (0, fs_1.readdirSync)(this.options.eventFolder).filter(function (f) { return f.endsWith(".js"); }).forEach(function (file) {
                    _this.client.on("" + file.split(".")[0], function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return require(_this.options.eventFolder + "/" + file).apply(void 0, __spreadArray([_this.client], args, false));
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    Handler.prototype.reloadCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.client.commands.clear();
                this.client.commandAliases.clear();
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this.setCommands()
                            .then(function (v) {
                            res({ commands: _this.client.commands, aliases: _this.client.commandAliases });
                            console.log("[ discord-slash-command-handler ] : Commands are reloaded");
                            _this.emit("commandsCreated", _this.client.commands, _this.client.commandAliases);
                        })
                            .catch(function (e) {
                            rej(e);
                            console.log("[ discord-slash-command-handler ] : There was a error in reloading the commands");
                            console.log(e);
                        });
                    })];
            });
        });
    };
    Handler.prototype.on = function (eventName, listener) {
        return _super.prototype.on.call(this, eventName, listener);
    };
    return Handler;
}(events_1.EventEmitter));
exports.default = Handler;
