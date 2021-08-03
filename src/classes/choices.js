class choices {
    /**
    * Choices of an option of a slash command
    * @param {String} name Name of the option 
    * @param {String} value value of the option 
    * @param {Number} type Type of the option 
    */
    constructor(name, value, type) {
        this.name = name;
        this.value = value;
        this.type = type;
    }
}

module.exports = choices;