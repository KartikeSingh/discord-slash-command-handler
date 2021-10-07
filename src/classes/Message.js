"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var Message = /** @class */ (function () {
    function Message(client, interaction, guild) {
        var _this = this;
        var _a;
        var args = [], keys = Object.keys(interaction);
        for (var i = 0; i < keys.length; i++) {
            this[keys[i]] = interaction[keys[i]];
        }
        (_a = interaction.options.data) === null || _a === void 0 ? void 0 : _a.forEach(function (v) { return args.push(v.value); });
        this.author = interaction.user;
        this.content = "/" + interaction.commandName + " " + args.join(" ");
        this.mentions = {
            channels: new discord_js_1.Collection(),
            members: new discord_js_1.Collection(),
            users: new discord_js_1.Collection(),
            roles: new discord_js_1.Collection(),
        };
        args.forEach(function (v) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var member = (_b = (_a = guild === null || guild === void 0 ? void 0 : guild.members) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.get(v);
            var user = (_d = (_c = client === null || client === void 0 ? void 0 : client.users) === null || _c === void 0 ? void 0 : _c.cache) === null || _d === void 0 ? void 0 : _d.get(v);
            var channel = (_f = (_e = guild === null || guild === void 0 ? void 0 : guild.channels) === null || _e === void 0 ? void 0 : _e.cache) === null || _f === void 0 ? void 0 : _f.get(v);
            var role = (_h = (_g = guild === null || guild === void 0 ? void 0 : guild.roles) === null || _g === void 0 ? void 0 : _g.cache) === null || _h === void 0 ? void 0 : _h.get(v);
            if (member)
                _this.mentions.members.set(member.id, member);
            if (user)
                _this.mentions.users.set(user.id, user);
            if (role)
                _this.mentions.roles.set(role.id, role);
            if (channel)
                _this.mentions.channels.set(channel.id, channel);
        });
    }
    return Message;
}());
exports.default = Message;
