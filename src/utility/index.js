const Options = [{
    name: "",
    description: "",
    type: "",
    required: true,
    choices: [{
        name: "",
        value: "",
        type: "",
    }]
}];


/**
 * @summary an function to fetch the options of an command.
 * @description This function will return the required and optional arguments
 * @access private
 * @param {String} args the string which includes the arguments
 * @param {String} argsDescription the string which includes the arguments Description
 * @param {String} argsType the string which includes the arguments Types
 * @returns {Array<Options>} Returns an array of options
 */
function getOptions(args, argsDescription = "", argsType = "") {
    let last = "", lastIndex = 0;args[0]
    argsDescription = argsDescription?.length > 1 ? argsDescription?.split("|") : undefined || [], argsType = argsType?.length > 1 ? argsType?.split("|") : undefined || [], index = 0;

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

/**
 * @summary an function to get the type integer.
 * @description This function will return the type integer from the type string.
 * @access private
 * @param {String} type the type which you want to convert to int type
 * @returns {Number} Returns the int type
 */
function getType(type) {
    type = type?.toUpperCase()?.trim();
    return type === "SUB_COMMAND" ? 1 : type === "SUB_COMMAND_GROUP" ? 2 : type === "STRING" ? 3 : type === "INTEGER" ? 4 : type === "BOOLEAN" ? 5 : type === "USER" ? 6 : type === "CHANNEL" ? 7 : type === "ROLE" ? 8 : 3;
}

module.exports = { getOptions, getType }

// 1 sub command, 2 sub command group, 3 string, 4 integer, 5 boolean , 6 user , 7 channel, 8 role, 9 mentionalble