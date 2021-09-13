const fs = require('fs');

class HandlerOptions {

    /**
     * 
     * @param {HandlerOption} options 
     */
    constructor(options) {
        if (options === true) return;
        const { permissionReply, timeoutMessage, errorReply, notOwnerReply, prefix, slashGuilds, owners, handleSlash, handleNormal, timeout, commandFolder, eventFolder, mongoURI, allSlash, commandType } = options;
        const { path } = require.main;

        this.commandFolder = `${path}/${commandFolder}`;
        this.eventFolder = eventFolder ? `${path}/${eventFolder}` : false;

        if (("commandType" in options) && (commandType !== "file" && commandType !== "folder")) throw new Error("Command type should be \"folder\" or \"folder\" but we got " + commandType)
        if (!fs.existsSync(this.commandFolder)) throw new Error("Invalid command folder, please provide an correct folder");
        if (this.eventFolder) if (!fs.existsSync(this.eventFolder)) throw new Error("Invalid event folder, please provide an correct folder");

        if (!prefix && handleNormal === true) throw new Error("Please provide a prefix");

        this.permissionReply = permissionReply || "{mention}, You don't have enough permissions to use {command} command";
        this.timeoutMessage = timeoutMessage || "{mention}, please wait for {remaining} before using {command} command";
        this.errorReply = errorReply || "Unable to run this command due to error";
        this.notOwnerReply = notOwnerReply || "Only bot owner's can use this command";
        this.commandType = commandType || "file";
        this.mongoURI = mongoURI || false;
        this.prefix = prefix;
        this.slashGuilds = slashGuilds || [];
        this.owners = owners || [];
        this.handleSlash = handleSlash || false;
        this.handleNormal = handleNormal || false;
        this.timeout = timeout || false;
        this.allSlash = allSlash || false;
    }
}

module.exports = HandlerOptions;

/**
     * The options for Command Handler
     * @typedef {Object} HandlerOption The options for the slash command handler
     * @property {String} commandFolder The location where all the commands are present.
     * @property {"folder" | "file"} commandType whether the command folder contains "folder" or "file".
     * @property {String} eventFolder The location where all the events are present.
     * @property {String} prefix The prefix of the bot.
     * @property {Boolean} handleNormal Whether the package have to handle normal commands or not.
     * @property {Boolean} handleSlash Whether the package have to handle slash commands or not.
     * @property {Boolean} allSlash Convert all commands to slash commands.
     * @property {Boolean} timeout Whether the package have to add timeouts or not.
     * @property {String} permissionReply The reply to give when user do not have enough permissions.
     * @property {String} timeoutMessage The reply to give when user is on timeout.
     * @property {String} errorReply The reply to give when there is a error in executing the command.
     * @property {String} notOwnerReply The reply to give when command is owner only and user is not owner.
     * @property {String} mongoURI The mongo URI.
     * @property {Array<String>} owners The array of owner's Discord ID.
     * @property {Array<String>} slashGuilds The array of server's Discord ID where you want the commands to work.
     */