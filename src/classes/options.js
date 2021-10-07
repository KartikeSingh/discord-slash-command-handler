"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var HandlerOptions = /** @class */ (function () {
    function HandlerOptions(options) {
        var _a = options.dmOnlyReply, dmOnlyReply = _a === void 0 ? "{mention}, **{command}** is a Guild Only command, please use it in a guild, not in DM Channel" : _a, _b = options.permissionReply, permissionReply = _b === void 0 ? "{mention}, You don't have enough permissions to use {command} command" : _b, _c = options.timeoutMessage, timeoutMessage = _c === void 0 ? "{mention}, please wait for {remaining} before using {command} command" : _c, _d = options.errorReply, errorReply = _d === void 0 ? "Unable to run this command due to error" : _d, _e = options.notOwnerReply, notOwnerReply = _e === void 0 ? "Only bot owner's can use this command" : _e, prefix = options.prefix, _f = options.slashGuilds, slashGuilds = _f === void 0 ? [] : _f, _g = options.owners, owners = _g === void 0 ? [] : _g, _h = options.handleSlash, handleSlash = _h === void 0 ? false : _h, _j = options.handleNormal, handleNormal = _j === void 0 ? false : _j, _k = options.timeout, timeout = _k === void 0 ? false : _k, commandFolder = options.commandFolder, _l = options.eventFolder, eventFolder = _l === void 0 ? undefined : _l, _m = options.mongoURI, mongoURI = _m === void 0 ? undefined : _m, _o = options.allSlash, allSlash = _o === void 0 ? false : _o, _p = options.commandType, commandType = _p === void 0 ? "file" : _p;
        var path = require.main.path;
        this.commandFolder = path + "/" + commandFolder;
        this.eventFolder = eventFolder ? path + "/" + eventFolder : undefined;
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
    return HandlerOptions;
}());
exports.default = HandlerOptions;
