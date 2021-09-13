# Installations

```
npm i discord-slash-command-handler
```

# Why use our package ?

* Fast and secure.
* Easy to use.
* Active support on discord.
* Easily convert normal commands to slash commands.
* Supports Database for timeouts.
* Advanced methods to handle commands and errors ( like timeouts, less arguments etc ) and can be automated too.
* #### We supports discord.js@13 and above

# Example bot source code
[here](https://github.com/KartikeSingh/discord-slash-command-bot)


# Basic handler example

```js
// NOTE : only Discord.js V 12 is supported
const client = new Discord.client(options);
const Handler = require('discord-slash-command-handler').Handler;

client.on('ready',()=>{
    // replace src/commands to the path to your commands folder.
    // if command folder contain files than commandType: "file" else commandType: "folder"
    const handler = new Handler(client, { guilds: ["guild id"], commandFolder:"/commands",commandType: "file" || "folder"});

    console.log("bot is up");
});

client.login(token);
```

# Complex handler example

```js
const client = new Discord.client(options);
const Handler = require('discord-slash-command-handler').Handler;

client.on('ready',()=>{
    // replace src/commands to the path to your commands folder.
    const handler = new Handler(client, {
        // Locations of folder should be provided with respect to the main file
        // Location of the command folder
        commandFolder:"/commands",

        // Folder contains files or folders ?
        commandType: "file" || "folder",

        // Location of the event folder
        eventFolder:"/events",

        // Guild ID(s) where you want to enable slash commands (if slash command isn't global)
        slashGuilds:["guild id"], 

        // Add MONGO URI for timeouts
        mongoURI:"some_mongo_uri",

        // Make all commands slash commands
        allSlash:true,

        // User ID(s) , these users will be considered as bot owners
        owners:["user id"], 
        
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
        notOwnerReply: "Only bot owner's can use this command",
    });

    console.log("bot is up");
});

client.login(token);
```

# Custom Command Handler ( Slash/Normal )

```js
...
bot.on('ready',()=>{
    ...

    // Custom normal command handler, this function works when handleNormal is 'both'
    handler.on('normalCommand',(command,command_data)=>{
        // handle the command
        // command is your normal command object , for command_data go down below to data types
    })

     
    // Custom slash command handler, this function works when handleSlash is 'both'
    handler.on('slashCommand',(command,command_data)=>{
        // handle the command
        // command is your normal command object , for command_data go down below to data types
    })
    ...
})
...
```

# Handle Arguments for Slash Commands
```js
run : async ({args}) => {
    // Wanna get an specific argument of a slash command?
    args.get("argument name goes here");
    // argument name = the one specified in options.

    // Other ways to get options
    args[0] // index
    args["some name"] // get argument from name
}
```

# All available events

```js
// this event is invoked when Commands are added to client / Commands are loaded
handler.on('commandsCreated',(commands ,commandAliases)=>{
     /*
      * commands : the collection of all the bot commands
      * commandAliases : the collection of all the bot command's aliases
      */
});

// this event is invoked when a user used a slash command and handleSlash is 'both'
handler.on('slashCommand',(command ,command_data)=>{
     /*
      * commands : the command used
      * command_data : the command data ( for more info read data types at bottom )
      */
});

// this event is invoked when a user used a normal command and handleNormal is 'both'
handler.on('normalCommand',(command ,command_data)=>{
     /*
      * commands : the command used
      * command_data : the command data ( for more info read data types at bottom )
      */
});

// This event is invoked when user don't provides enough arguments in a command
handler.on('lessArguments',(command ,message)=>{
     /*
      * commands : the command used
      * message : the Discord message object
      */
});

// This event is invoked when command is owner only but user is not an owner
handler.on('notOwner',(command ,message)=>{
     /*
      * commands : the command used
      * message : the Discord message object
      */
});

// This event is invoked when user don't have enough permissions to use a command
handler.on('noPermission',(command ,message)=>{
     /*
      * commands : the command used
      * message : the Discord message object
      */
});

    // This event is invoked when user is on a timeout to use a command
handler.on('timeout',(command ,message)=>{
     /*
      * commands : the command used
      * message : the Discord message object
      */
});

// This event is invoked when an unknown error occurs while running a command
handler.on('exception',(command ,message,error)=>{
     /*
      * commands : the command used
      * message : the Discord message object
      * error : the error
      */
});
```

# How to define command

Advanced Method
```js
const Command = require("discord-slash-command-handler").Command;

class commandName extends Command {
     /**
     * The list of paramters
     * @param {String} name The name of the command
     * @param {String} description The description of the command
     * @param {Array<String>} aliases The aliases of the command
     * @param {String} category The catgory Command belongs to
     * @param {"true" | "false" | "both"} slash Wether the command is an slash command or normal or both
     * @param {Boolean} global Wether the SLASH command works globally
     * @param {Boolean} ownerOnly Wether the command can only be accessed by the owner of the client
     * @param {Number} timeout The cooldown for the command in milliseconds
     * @param {String} args The arguments for a command
     * @param {String} argsType The argument type used for slash command
     * @param {String} argsDescription The argument description used for slash command
     * @param {Array<Options>} options The array of options for slash commands
     */
    constructor() {
        super("commandName", "Command Description", ["An Aliases"], "Cool Category", "true", false, false, 5000, "<haha>", "", "", []);
    }

    async run(commandData) {
        // Do your thing
    }

    // Optional
    error:async (errorType, command, message, error)=>{
        // Handle the errors
    })
}
module.exports = new commandName();
```

Basic Method
```js
file name : help.js

module.exports = {
    name:"help", // Name of the command

    description:"Get some help", // Description of the command
    
    aliases:["gethelp"], // The aliases for command ( don't works for slash command )
    
    category:"general", // the category of command
    
    slash: "both", // true => if only slash, false => if only normal, "both" => both slash and normal
    
    global:false, // false => work in all guilds provided in options, true => works globally

    ownerOnly:false, // false => work for all users, true => works only for bot owners
    
    dm:false, // false => Guild Only, true => Both Guild And DM, "only" => DM Only

    timeout:10000 | '10s', // the timeout on the command
    
    args:"< command category > [ command name ]", // Command arguments, <> for required arguments, [] for optional arguments ( please provide required arguments before optional arguments )

    // Arguments for slash commands

    // first method
    args:"< command category > [ command name ]", // Command arguments, <> for required arguments, [] for optional arguments ( please provide required arguments before optional arguments )

    argsType:"String | String", // OPTIONAL, if you want to specify the argument type
    // Available Types : String, Integer, Boolean, Channel, User, Role
    // also Sub_command, Sub_command_group but these aren't tested yet

    argsDescription:"The command category | the command name", // OPTIONAL, if you wanna add a cute little description for arguments

    // Second method
    // All properties are required, if not provided than you will get an error
    options:[
        {
            name:"name of argument",
            description:"description of the argument",
            require:true or false,
            type:"string"
        }
    ],

    // OPTIONAL
    error:async (errorType, command, message, error)=>{
        // If you want custom error handler for each command 
        /*
         * errorType : errorType ( check in data types at bottom for more info )
         * command : the command
         * message : the message object
         * error : only in exceptions, the error message 
         */
    }

    // Required
    run: async (command_data) => {
        // your command's code
    }
}
```

# Convert Normal Command to Slash Command

## Additions
```js
// Add slash porperty
slash : true, // true => only slash command, "both" => slash and normal command, false => normal command

// All done. but there are few limitations like, message object is not Discord.Message object
// it is an custom objected created by us its properties are listen in # datatype 's slash_command
```

## Changes
```js
// All of the message functions will not work

// Examples : 
message.reply() , message.delete() // etc will not work

// try using
channel.send()
// Still having troubles ? contact me on discord
```

# Specials
```js
...

handler.reloadCommands(); // to reload the commands

...
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

errorType = "noPermission" | "exception" | "lessArguments" | "timeout";
```


# Report Problems at

[Github](https://github.com/KartikeSingh/discord-slash-command-handler/issues)

# Links

[Discord](https://discord.gg/XYnMTQNTFh)