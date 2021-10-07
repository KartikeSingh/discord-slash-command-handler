import { DMChannel, Guild, GuildMember, Message, TextBasedChannels, TextChannel, User } from 'discord.js';
import Handler from './classes/handler';
import Args from './classes/args';
import _Message from './classes/Message';
import Client from './classes/Client';

export interface CommandData {
    client: Client,
    guild: Guild,
    channel: TextChannel | DMChannel | TextBasedChannels,
    interaction: _Message | undefined,
    args: Args,
    member: GuildMember | undefined,
    user: User,
    message: Message | _Message,
    handler: Handler,
    subCommand?: string | undefined,
    subCommandGroup?: string | undefined,
}

export interface Command {
    name: string,
    description: string,
    permissions?: string[],
    type?: string | number,
    aliases?: string[],
    category?: string,
    slash?: "both" | boolean,
    global?: boolean,
    ownerOnly?: boolean,
    dm?: "only" | boolean,
    timeout?: number | string,
    args?: string,
    argsType?: string | number,
    argsDescription?: string,
    options?: [{
        name: string,
        description: string,
        required: boolean,
        type: string | number,
    }],

    error?: (errorType: string, command: Command, interaction: Message | _Message, error?: Error) => void,

    run(commandData: CommandData): void;
    run(client: Client, interaction: Message | _Message, args: Args, handler: Handler, subCommand: string | undefined, subCommandGroup: string | undefined): void;
}