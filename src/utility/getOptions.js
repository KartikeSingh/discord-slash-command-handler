const Options = require('../classes/commandOptions');
const commandOptions = new Options(true);
const getType = require("./getType");

/**
 * This function will return the required and optional arguments of the slash command
 * @param {String} args the string which includes the arguments
 * @param {String} argsDescription the string which includes the arguments Description
 * @param {String} argsType the string which includes the arguments Types
 * @returns {Array<commandOptions>} Returns an array of options
 */

function getOptions(args, argsDescription = "", argsType = "") {
    let last = "", lastIndex = 0;
    argsDescription = argsDescription?.length > 1 ? argsDescription?.split("|") : [] || [], argsType = argsType?.length > 1 ? argsType?.split("|") : [] || [], index = 0;

    const req = [], opt = [];

    for (let i = 0; i < args.length; i++) {
        if (last === "<" ? args[i] === ">" : args[i] === "]") {
            last === "<" ? req.push({ name: args.substring(lastIndex + 1, i).replace(/ /g, "-").toLowerCase(), required: true, description: argsDescription[index] || args.substring(lastIndex + 1, i), type: getType(argsType[index]?.trim()?.toUpperCase()) || "STRING" }) : opt.push({ name: args.substring(lastIndex + 1, i).replace(/ /g, "-").toLowerCase(), required: false, description: argsDescription[index] || args.substring(lastIndex + 1, i), type: getType(argsType[index]?.trim()?.toUpperCase()) || "STRING" });
            index++;
        }

        if (args[i] === "<" || args[i] === "[") {
            last = args[i];
            lastIndex = i;
        }
    }

    return req.concat(opt);
}

module.exports = getOptions;