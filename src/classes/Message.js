"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = (interaction) => {
    var _a, _b;
    const args = [];
    const guild = interaction.guild, client = interaction.client;
    (_b = (_a = interaction === null || interaction === void 0 ? void 0 : interaction.options) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.forEach((v) => args.push(v.value));
    interaction.author = interaction.user;
    interaction.content = `/${interaction.commandName} ${args.join(" ")}`;
    interaction.mentions = {
        channels: new discord_js_1.Collection(),
        members: new discord_js_1.Collection(),
        users: new discord_js_1.Collection(),
        roles: new discord_js_1.Collection(),
    };
    args === null || args === void 0 ? void 0 : args.forEach(v => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let member = (_b = (_a = guild === null || guild === void 0 ? void 0 : guild.members) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.get(v);
        let user = (_d = (_c = client === null || client === void 0 ? void 0 : client.users) === null || _c === void 0 ? void 0 : _c.cache) === null || _d === void 0 ? void 0 : _d.get(v);
        let channel = (_f = (_e = guild === null || guild === void 0 ? void 0 : guild.channels) === null || _e === void 0 ? void 0 : _e.cache) === null || _f === void 0 ? void 0 : _f.get(v);
        let role = (_h = (_g = guild === null || guild === void 0 ? void 0 : guild.roles) === null || _g === void 0 ? void 0 : _g.cache) === null || _h === void 0 ? void 0 : _h.get(v);
        if (member)
            interaction.mentions.members.set(member.id, member);
        if (user)
            interaction.mentions.users.set(user.id, user);
        if (role)
            interaction.mentions.roles.set(role.id, role);
        if (channel)
            interaction.mentions.channels.set(channel.id, channel);
    });
    return interaction;
};
