import { CommandInteraction, ContextMenuInteraction, DMChannel, Guild, GuildMember, Message, TextBasedChannels, TextChannel, User } from 'discord.js';
import Handler from './classes/handler';
import Args from './classes/args';
import _Message from './classes/Message';
import Client from './classes/Client';

export interface CommandData {
    client: Client,
    guild: Guild,
    channel: TextChannel | DMChannel | TextBasedChannels,
    interaction: CommandInteraction | undefined,
    args: Args,
    member: GuildMember | undefined,
    user: User,
    message: Message | CommandInteraction,
    handler: Handler,
    subCommand?: string | undefined,
    subCommandGroup?: string | undefined,
}

export interface Command {
    name: string,
    description: string,
    permissions?: string[],
    type?: number,
    aliases?: string[],
    category?: string,
    slash?: "both" | boolean,
    global?: boolean,
    ownerOnly?: boolean,
    dm?: "only" | boolean,
    timeout?: number | string,
    args?: string,
    argsType?: string,
    argsDescription?: string,
    options?: Options[],

    error(eventName: "exception", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message, error: Error): void;
    error(eventName: "guildOnly", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message): void;
    error(eventName: "dmOnly", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message): void;
    error(eventName: "notOwner", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message): void;
    error(eventName: "timeout", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message, timeRemaining: Number): void;
    error(eventName: "noPermissions", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message): void;
    error(eventName: "lessArguments", command: Command, interaction: CommandInteraction | ContextMenuInteraction | Message): void;

    run(...args: any[]): void;
}

interface Options {
    name: string,
    description: string,
    required: boolean,
    type?: string | number,
    choices?: string | number,
    options?: [Options]
}