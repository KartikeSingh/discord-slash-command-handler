const fs = require('fs');

class HandlerOptions {
    /**
     * The options for Command Handler
     * @param {HandlerOptions} options 
     */
    constructor(options) {
        const { permissionReply, timeoutMessage, errorReply, notOwnerReply, prefix, slashGuilds, owners, handleSlash, handleNormal, timeout, commandFolder, eventFolder } = options;

        const { path } = require.main;

        this.commandFolder = `${path}/${commandFolder}`;
        this.eventFolder = `${path}/${eventFolder}`;

        if (!fs.existsSync(this.commandFolder)) throw new Error("Invalid command folder, please provide an correct folder");
        if (this.eventFolder) if (!fs.existsSync(this.eventFolder)) throw new Error("Invalid event folder, please provide an correct folder");

        if (!prefix && handleNormal === true) throw new Error("Please provide a prefix");

        this.permissionReply = permissionReply || "{mention}, You don't have enough permissions to use {command} command";
        this.timeoutMessage = timeoutMessage || "{mention}, please wait for {remaining} before using {command} command";
        this.errorReply = errorReply || "Unable to run this command due to error";
        this.notOwnerReply = notOwnerReply || "Only bot owner's can use this command";
        this.prefix = prefix;
        this.slashGuilds = slashGuilds || [];
        this.owners = owners || [];
        this.handleSlash = handleSlash || false;
        this.handleNormal = handleNormal || false;
        this.timeout = timeout || false;
    }
}

module.exports = HandlerOptions;