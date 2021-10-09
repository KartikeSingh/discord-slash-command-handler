const fs = require('fs');

class HandlerOptions {
    /**
     * The location where all the commands are present.
     */
    commandFolder: string;

    /**
     * The location where all the events are present.
     */
    eventFolder?: string;

    /**
     * The reply to give when user do not have enough permissions.
     */
    permissionReply?: string;

    /**
     * The reply to give when user is on timeout.
     */
    timeoutMessage?: string;

    /**
     * The reply to give when there is a error in executing the command.
     */
    errorReply?: string;

    /**
     * The reply to give when command is owner only and user is not owner.
     */
    notOwnerReply?: string;

    /**
     * The reply to give when command is dm only but used in a guild.
     */
    dmOnlyReply?: string;

    /**
     * The reply to give when command guild only, but used in dm.
     */
    guildOnlyReply?: string;

    /**
     * The type of commands present inside command folder, possible types "folder" | "file". 
     */
    commandType?: "folder" | "file";

    /**
     * The mongo URI, Provided when you want to connect timeout with mongo DB
     */
    mongoURI?: string;

    /**
     * The prefix for message based commands
     */
    prefix?: string;

    /**
     * The array of server's Discord ID where you want the commands to work.
     */
    slashGuilds?: string[];

    /**
     * The array of owner's Discord ID.
     */
    owners?: string[] | string;

    /**
     * Whether the package have to handle normal commands or not.
     */
    handleSlash?: boolean;

    /**
     * Whether the package have to handle slash commands or not.
     */
    handleNormal?: boolean;

    /**
     * Whether the package have to add timeouts or not.
     */
    timeout?: boolean;

    /**
     * Consider all commands as slash commands.
     */
    allSlash?: boolean;

    /**
     * Auto defer the slash commands
     */
    autoDefer?: boolean;

    /**
     * Choose the sequence of paramters for your run commands
     * for more information read docs
     */
    runParameters: string[];

    constructor(options: HandlerOptions) {
        const { dmOnlyReply = "{mention}, **{command}** is a Guild Only command, please use it in a guild, not in DM Channel", permissionReply = "{mention}, You don't have enough permissions to use {command} command", timeoutMessage = "{mention}, please wait for {remaining} before using {command} command", errorReply = "Unable to run this command due to error", notOwnerReply = "Only bot owner's can use this command", prefix, slashGuilds = [], owners = [], handleSlash = false, handleNormal = false, timeout = false, commandFolder, eventFolder = undefined, mongoURI = undefined, allSlash = false, commandType = "file", autoDefer = true, runParameters = ["0"] } = options;
        const { path } = require.main;

        this.commandFolder = `${path}/${commandFolder}`;
        this.eventFolder = eventFolder ? `${path}/${eventFolder}` : undefined;

        if (("commandType" in options) && (commandType !== "file" && commandType !== "folder")) throw new Error("Command type should be \"folder\" or \"folder\" but we got " + commandType)
        if (!fs.existsSync(this.commandFolder)) throw new Error("Invalid command folder, please provide an correct folder");

        if (!prefix && handleNormal === true) throw new Error("Please provide a prefix, If you want us to handle normal commands for you");

        this.runParameters = runParameters;
        this.autoDefer = autoDefer;
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

export default HandlerOptions;