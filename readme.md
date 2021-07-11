# Installations

```
npm i discord-slash-command-handler
```

# Basic handler example

```js
const client = new Discord.client(options);
const Handler = require('discord-slash-command-handler');

client.on('ready',()=>{
    const handler = new Handler(client,"src/commands",{guilds:["guild id"]});

    console.log("bot is up");
});

client.login(token);
```

# Complex handler example

```js
const client = new Discord.client(options);
const Handler = require('discord-slash-command-handler');

client.on('ready',()=>{
    const handler = new Handler(client,"src/commands",
    {
        slashGuilds:["guild id"], // Guild ID(s) where you want to enable slash commands (if slash command isn't global)
        handleSlash: true, //  If you want automatic slash handler, false for no handler, both for both automaitc and non automatic handler more expalantion is give below
        handleNormal: false,//  If you want automatic normal handler, false for no handler, both for both automaitc and non automatic handler more expalantion is give below
        prefix: "k!", // Bot's prefix
        timeouts: true, // If you want to add timeouts in commands
        handleTimeout: true, // if you want us to handle timeouts, false if not
        permissionReply: "You don't have enough permissions to use this command", // reply to send when user don't have enough permissions to use the command
        timeoutMessage: "You are on a timeout", // reply to send when user is on a timeout
        errorReply: "Unable to run this command due to errors", // reply to send when there is an error in command
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

    // Custom normal command handler
    handler.on('normalCommand',(command,command_data)=>{
        // handle the command
        // command is your normal command object , for command_data go down below to data types
    })

     
    handler.on('slashCommand',(command,command_data)=>{
        // handle the command
        // command is your normal command object , for command_data go down below to data types
    })
    ...
})
...
```

# All available events

```js
handler.on('commandsCreated',(commands,commandAliases)=>{
    // this event is invoked when commands are added
    /**
      * commands : the collection of all the bot commands
      * commandAliases : the collection of all the bot command's aliases
      */
});

handler.on('slashCommand',(commands,command_data)=>{
    // this event is invoked when a user used a slash command
    /**
      * commands : the command used
      * command_data : the command data ( for more info read data types at bottom )
      */
});

handler.on('normalCommand',(commands,command_data)=>{
    // this event is invoked when a user used a normal command
    /**
      * commands : the command used
      * command_data : the command data ( for more info read data types at bottom )
      */
});

handler.on('lessArguments',(commands,message)=>{
    // This event is invoked when user don't provides enough arguments in a command
    /**
      * commands : the command used
      * message : the Discord message object
      */
});

handler.on('noPermission',(commands,message)=>{
    // This event is invoked when user don't have enough permissions to use a command
    /**
      * commands : the command used
      * message : the Discord message object
      */
});

handler.on('timeout',(commands,message)=>{
    // This event is invoked when user is on a timeout to use a command
    /**
      * commands : the command used
      * message : the Discord message object
      */
});

handler.on('exception',(commands,message,error)=>{
    // This event is invoked when an unknown error occurs while running a command
    /**
      * commands : the command used
      * message : the Discord message object
      * error : the error
      */
});
```

# How to define command

```js
file name : help.js

module.exports = {
    name:"help", // Name of the command

    description:"Get some help", // Description of the command
    
    aliases:["gethelp"], // The aliases for command ( don't works for slash command )
    
    category:"general", // the category of command
    
    slash: "both", // true => if only slash, false => if only normal, "both" => both slash and normal
    
    global:false, // false => work in all guilds provided in options, true => works globally
    
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
            require:true/false,
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
        // you command code
        // you can replace run to execute too.
    }
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
}

slash_message = {
    member, // the guild member object
    author, // the user 
    client, // the instance of your client
    guild, // the guild where command was used
    channel, // the channel where command was used
    interaction, // the ineraction if it is an slash command
    content, // the message contnet
}

errorType = "noPermission" | "exception" | "lessArguments" | "timeout";
```

# Report Problems at

[Github](https://github.com/KartikeSingh/discord-slash-command-handler/issues)

# Links

[Support Server](https://discord.gg/XYnMTQNTFh)