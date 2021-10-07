import  { Client, ClientOptions, Collection } from 'discord.js';
import { Command } from '../interfaces';

class client extends Client {
    commands: Collection<string, Command>;
    commandAliases: Collection<string, string>;

    constructor(options: ClientOptions) {
        super(options);

        this.commands = new Collection();
        this.commandAliases = new Collection();
    }
}

export default client;