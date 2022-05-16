# Installations

```
npm i discord-slash-command-handler
```

# Why use our package?

* Fast and secure.
* Easy to use.
* Active support on discord.
* Easily convert normal commands to slash commands.
* Supports Database for timeouts.
* Automatic Handling
* Advanced methods to handle commands and errors ( like timeouts, less arguments etc ) and can be automated too.
* We support discord.js@13.x.x
* Example [source code](https://github.com/KartikeSingh/discord-slash-command-bot)

## Request
Please provide suggestions, bug reports either on [discord](https://discord.gg/PBFj276RUw) or [github issues](https://github.com/KartikeSingh/discord-slash-command-handler/issues/)

# Basic handler example

```js
// NOTE: This package only supports Discord.js V 13
const client = new Discord.client(options);
const { Handler } = require('discord-slash-command-handler');

client.on('ready', () => {
    // replace src/commands to the path with your commands folder.
    // if your commands folder contain files then use commandType: "file". otherwise commandType: "folder"
    const handler = new Handler(client, { guilds: ["guild id"], commandFolder: "/commands",commandType: "file" || "folder"});

    console.log("bot is up!");
});

client.login(token);
```

# Complex handler example

```js
const client = new Discord.client(options);
const { Handler } = require('discord-slash-command-handler');

client.on('ready', () => {
    // replace src/commands to the path to your commands folder.
    const handler = new Handler(client, {
        // Locations of folder should be provided with respect to the main file
        // Location of the command folder
        commandFolder: "/commands",

        // Folder contains files or folders ?
        commandType: "file" || "folder",

        // Location of the event folder
        eventFolder: "/events",

        // Guild ID(s) where you want to enable slash commands (if slash command isn't global)
        slashGuilds: ["guild id"], 

        // Add MONGO URI for timeouts
        mongoURI: "some_mongo_uri",

        // Make all commands slash commands
        allSlash: true,

        // User ID(s),  these users will be considered as bot owners
        owners: ["user id"], 
        
        handleSlash: true, 
        /* True => If you want automatic slash handler
         * False => if you want to handle commands yourself
         * 'both' =>  in this case instead of running the command itself we will invoke an event called 'slashCommand'
         */
        
        handleNormal: false,
        /* True => If you want automatic normal handler
         * False => if you want to handle commands yourself
         * 'both' =>  in this case instead of running the command itself we will invoke an event called 'normalCommand'
         */

        prefix: "k!", // Bot's prefix
        timeout: true, // If you want to add timeouts in commands
        
        // reply to send when user don't have enough permissions to use the command
        permissionReply: "You don't have enough permissions to use this command",   

        // reply to send when user is on a timeout      
        timeoutMessage: "You are on a timeout",

        // reply to send when there is an error in command
        errorReply: "Unable to run this command due to errors",

        // reply to send when command is ownerOnly and user isn't a owner
        notOwnerReply: "Only bot owners can use this command",
    });

    console.log("bot is up");
});

client.login(token);
```

# Custom Command Handler (Slash/Normal)

```js
...
bot.on('ready', () => {
    ...

    // Custom normal command handler, this function works when handleNormal is 'both'
    handler.on('normalCommand', (command,command_data) => {
        // handle the command
        // command is your normal command object,  for command_data go down below to data types
    })

     
    // Custom slash command handler, this function works when handleSlash is 'both'
    handler.on('slashCommand', (command,command_data) => {
        // handle the command
        // command is your normal command object,  for command_data go down below to data types
    })
    ...
})
...
```

# Handle Arguments for Slash Commands
```js
run: async ({ args }) => {
    // Wanna get an specific argument of a slash command?
    args.get("argument name goes here");
    // argument name = the one specified in options.

    // Other ways to get options
    args[0] // index
    args["some name"] // get argument from name
}
```

# How to define command

```js
// file name: help.js

module.exports = {
    name: "help", // Name of the command

    description: "Get some help", // Description of the command
    
    aliases: ["gethelp"], // The aliases for command ( don't works for slash command )
    
    category: "general", // the category of command
    
    slash: "both", // true => if only slash, false => if only normal, "both" => both slash and normal
    
    global: false, // false => work in all guilds provided in options, true => works globally

    ownerOnly: false, // false => work for all users, true => works only for bot owners
    
    dm: false, // false => Guild Only, true => Both Guild And DM, "only" => DM Only

    timeout: 10000 | '10s', // the timeout on the command
    
    args: "< command category > [ command name ]", // Command arguments, <> for required arguments, [] for optional arguments ( please provide required arguments before optional arguments )

    // Arguments for slash commands

    // first method
    args: "< command category > [ command name ]", // Command arguments, <> for required arguments, [] for optional arguments ( please provide required arguments before optional arguments )

    argsType: "String | String", // OPTIONAL, if you want to specify the argument type
    // Available Types: String, Integer, Boolean, Channel, User, Role
    // also Sub_command, Sub_command_group but these aren't tested yet

    argsDescription: "The command category | the command name", // OPTIONAL, if you wanna add a cute little description for arguments


    // Second method
    // All properties are required, if not provided than you will get an error
    // NOTE: You can also use a command builder for the options
    options: [
        {
            name: "name of argument",
            description: "description of the argument",
            require: true or false,
            type: "string"
        }
    ],

    // OPTIONAL
    error: async (errorType, command, message, error) => {
        // If you want custom error handler for each command 
        /*
         * errorType: errorType ( check in data types at bottom for more info )
         * command: the command
         * message: the message object
         * error: only in exceptions, the error message 
         */
    },

    // Required
    run: async (command_data) => { // you can add custom run arguments
        // your command's code
    }
}
```

# Convert Normal Command to Slash Command

## Additions
```js
// Add slash porperty
slash: true, // true => only slash command, "both" => slash and normal command, false => normal command

// you have to fix your run method or add custom run command parameter in handler options for that check #specials

// All done. but there are few limitations like, message object is not Discord.Message object
// it is an custom objected created by us its properties are listen in # datatype 's slash_command
```

# All available events

```js
/**
 * this event is invoked when Commands are added to client / Commands are loaded
 * @param {Collection<string,command>} commands The collection of commands
 * @param {Collection<string,string>} commandAliases The collection of command aliases
 */
handler.on('commandsCreated', (commands, commandAliases) => { });

/**
 * this event is invoked when a user used a slash command and handleSlash is 'both'
 * @param {command} command the command used
 * @param {Object} command_data the command data, check #types for more information
 */
handler.on('slashCommand', (command, command_data) => { });

/**
 * this event is invoked when a user used a normal command and handleNormal is 'both'
 * @param {command} command the command used
 * @param {Object} command_data the command data, check #types for more information
 */
handler.on('normalCommand', (command, command_data) => { });

/**
 * This event is invoked when user don't provides enough arguments in a command
 * @param {command} command the command used
 * @param {message | interaction} message The Command Interaction or the message
 */
handler.on('lessArguments', (command, message) => { });

/**
 * This event is invoked when command is owner only but user is not an owner
 * @param {command} command the command used
 * @param {message | interaction} message The Command Interaction or the message
 */
handler.on('notOwner', (command, message) => { });

/**
 * This event is invoked when user don't have enough permissions to use a command
 * @param {command} command the command used
 * @param {message | interaction} message The Command Interaction or the message
 */
handler.on('noPermissions', (command, message) => {
    /*
     * commands: the command used
     * message: the Discord message object
     */
});

/**
 * This event is invoked when user is on a mOnly to use a command
 * @param {command} command the command used
 * @param {message | interaction} message The Command Interaction or the message
 */
handler.on('timeout', (command, message) => { });

/**
 * This event is invoked when a command is DM only but used in a guild
 * @param {command} command the command used
 * @param {message | interaction} message The Command Interaction or the message
 */
handler.on('dmOnly', (command, message) => { });

/**
* This event is invoked when a command is guild only but used in a DM
* @param {command} command the command used
* @param {message | interaction} message The Command Interaction or the message
*/
handler.on('guildOnly', (command, message) => { });

/**
 * This event is invoked when an unknown error occurs while running a command
 * @param {command} command the command used
 * @param {message | interaction} message The Command Interaction or the message
 * @param {Error} error the error
 */
handler.on('exception', (command, message, error) => { });
```

# Specials
- ### Reload Commands
```js
...

handler.reloadCommands(); // to reload the commands

...
```

- ### Custom run parameters
```js
const { Handler } = require('discord-slash-command-handler');

const handler = new Handler({
    runParameters: ["1","2"] || ["12","3"] || ["0"]
});

// Number refers to different values, if provided more than one number in the string than it returns a object.
const type = {
    1: "client",
    2: "guild",
    3: "channel",
    4: "interaction",
    5: "args",
    6: "member",
    7: "user",
    8: "message",
    9: "handler"
}
```

# Date Types

```js
command_data = {
    client, // your discord client instance
    guild, // the guild in which command was used
    channel, // the channel in which command was used
    interaction, // interaction if it is an slash command
    args, // the array of arguments
    member, // the guild member object
    message, // the message object if normal command, in slash command it have less attributes ( to check its attribute read slash_message )
    handler, // the instance of your command handler
}

slash_message = {
    member, // the guild member object
    author, // the user 
    client, // the instance of your client
    guild, // the guild where command was used
    channel, // the channel where command was used
    interaction, // the ineraction if it is an slash command
    content, // the message contnet
    createdAT, // timestamps of the message creation
}

errorType = "noPermissions" | "exception" | "lessArguments" | "timeout" | "dmOnly" | "guildOnly";
```


# Report Problems at [Github](https://github.com/KartikeSingh/discord-slash-command-handler/issues)

# Links
[Discord Server](https://discord.gg/XYnMTQNTFh)
[Refactored By](https://hug-me.vercel.app/)