import Client from "./Client";
import { connect } from 'mongoose';
import timeout from '../models/timeout';

class Timeout {
    client: Client;
    mongoURI: string;
    cached: Map<string, CommandTimeout>;
    constructor(client: Client, mongoURI: string = "no_uri") {
        this.client = client;
        this.mongoURI = mongoURI;
        this.cached = new Map();

        if (mongoURI !== "no_uri") this.connect().then(v => console.log("[ discord-slash-command-handler ] : Mongoose Database Connected Successfully")).catch(e => { throw new Error("Invalid MONGO_URI was provided in Discord-Slash-Command_handler") });
    }

    async connect() {
        return new Promise((resolve, reject) => {
            connect(this.mongoURI).then(v => resolve(v)).catch(e => reject(e));
        })
    }

    async getTimeout(user: string, command: string): Promise<CommandTimeout> {
        return new Promise(async (resolve) => {
            let data = {
                user: "1",
                command: "1",
                from: 0,
            };

            if (this.mongoURI === "no_uri") {
                if (!this.cached.has(`${user}_${command}`)) this.cached.set(`${user}_${command}`, { from: 0, user, command });
                data = this.cached.get(`${user}_${command}`);
            } else {
                data = await timeout.findOne({ user, command }) || await timeout.create({ user, command, from: 0 })
            }

            return resolve(data);
        })
    }

    async setTimeout(user: string, command: string, time: number): Promise<CommandTimeout> {
        return new Promise(async (resolve) => {
            let data = {
                user: "1",
                command: "1",
                from: 0,
            };

            if (this.mongoURI === "no_uri") {
                this.cached.set(`${user}_${command}`, { from: time, command, user });
                data = this.cached.get(`${user}_${command}`);
            }
            else {
                data = await timeout.findOneAndUpdate({ user, command }, { from: time }) || await timeout.create({ user, command, from: time });
            }

            resolve(data);
        })
    }
}

export default Timeout;

interface CommandTimeout {
    from: number,
    command: string,
    user: string
}