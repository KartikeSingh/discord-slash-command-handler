const choices = require('./choices');

class commandOptions {
    /**
     * 
     * @param {String} name Name of the option 
     * @param {String} description Description of the option 
     * @param {Number} type Type of the option 
     * @param {Boolean} required Options is required or not 
     * @param {Array<choices>} choices choices of the option 
     */
    constructor(name, description, type, required, choices) {

        if (name === true) return;
        
        this.name = name.toLowerCase();
        this.description = description;
        this.type = type || 3;
        this.required = required || false;
        this.choices = choices || [];
    }
}

module.exports = commandOptions;