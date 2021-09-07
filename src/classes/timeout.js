const mongoose = require('mongoose');
const timeout = require('../models/timeout');

class Timeout {
    constructor(client, mongoURI = "no_uri") {
        this.client = client;
        this.mongoURI = mongoURI;
        this.cached = new Map();

        if (mongoURI !== "no_uri") this.connect().catch(e => { throw new Error("Invalid MONGO_URI was provided in Discord-Slash-Command_handler") }).then(v=>console.log("[ discord-slash-command-handler ] : Mongoose Database Connected Successfully"))
    }

    async connect() {
        return new Promise((resolve, reject) => {
            mongoose.connect(this.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true }).then(v => resolve(v)).catch(e => reject(e));
        })
    }

    async getTimeout(user, command) {
        return new Promise(async (resolve) => {
            let data = {};

            if (this.mongoURI === "no_uri") {
                if (!this.cached.has(`${user}_${command}`)) this.cached.set(`${user}_${command}`, { at: 0 });
                data = this.cached.get(`${user}_${command}`);
            } else {
                data = await timeout.findOne({ user, command }) || await timeout.create({ user, command, at: 0 })
            }

            return resolve(data);
        })
    }

    async setTimeout(user, command, time) {
        return new Promise(async (resolve) => {
            if (this.mongoURI === "no_uri") {
                this.cached.set(`${user}_${command}`, { at: time });
            }
            else {
                const data = await timeout.findOneAndUpdate({ user, command }, { at: time }) || await timeout.create({ user, command, at: time });
            }

            resolve("done");
        })
    }
}

module.exports = Timeout;