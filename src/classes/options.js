"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
class HandlerOptions {
    constructor(options) {
        const { dmOnlyReply = "{mention}, **{command}** is a Guild Only command, please use it in a guild, not in DM Channel", permissionReply = "{mention}, You don't have enough permissions to use {command} command", timeoutMessage = "{mention}, please wait for {remaining} before using {command} command", errorReply = "Unable to run this command due to error", notOwnerReply = "Only bot owner's can use this command", prefix, slashGuilds = [], owners = [], handleSlash = false, handleNormal = false, timeout = false, commandFolder, eventFolder = undefined, mongoURI = undefined, allSlash = false, commandType = "file" } = options;
        const { path } = require.main;
        this.commandFolder = `${path}/${commandFolder}`;
        this.eventFolder = eventFolder ? `${path}/${eventFolder}` : undefined;
        if (("commandType" in options) && (commandType !== "file" && commandType !== "folder"))
            throw new Error("Command type should be \"folder\" or \"folder\" but we got " + commandType);
        if (!fs.existsSync(this.commandFolder))
            throw new Error("Invalid command folder, please provide an correct folder");
        if (!prefix && handleNormal === true)
            throw new Error("Please provide a prefix, If you want us to handle normal commands for you");
        this.dmOnlyReply = dmOnlyReply;
        this.permissionReply = permissionReply;
        this.timeoutMessage = timeoutMessage;
        this.errorReply = errorReply;
        this.notOwnerReply = notOwnerReply;
        this.commandType = commandType;
        this.mongoURI = mongoURI || undefined;
        this.prefix = prefix;
        this.slashGuilds = slashGuilds || [];
        this.owners = typeof (owners) === "string" ? owners.split(",") : owners || [];
        this.handleSlash = handleSlash || false;
        this.handleNormal = handleNormal || false;
        this.timeout = timeout || false;
        this.allSlash = allSlash || false;
    }
}
exports.default = HandlerOptions;
