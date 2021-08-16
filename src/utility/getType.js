/**
 * This function will return the type integer from the type string.
 * @access private
 * @param {String} type the type which you want to convert to int type
 * @returns {Number} Returns the int type
 */
 function getType(type) {
    try {
        if (typeof (type) === "number" && type > 0 && type < 9) return type;
        type = type;
        if(!type)return 3;
        type = type.toUpperCase().trim();
        return type === "SUB_COMMAND" ? 1 : type === "SUB_COMMAND_GROUP" ? 2 : type === "STRING" ? 3 : type === "INTEGER" ? 4 : type === "BOOLEAN" ? 5 : type === "USER" ? 6 : type === "CHANNEL" ? 7 : type === "ROLE" ? 8 : 3;
    } catch (e) {
        return 3;
    }
}

module.exports = getType;