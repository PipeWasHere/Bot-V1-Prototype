require("dotenv").config()
const dotenv = require("dotenv")

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const Discord = require('discord.js')
const { Client, Intents, Collections, GatewayIntentBits } = require('discord.js');

const LOAD_SLASH = process.argv[2] == "load"

const fs = require('node:fs');
const path = require('node:path');

const client = new Discord.Client({ intents: [
    GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
    ] 
})

let bot = {
    client,
    prefix: "p.",
    owners: [process.env.OWNER]
}

client.on("ready", () => {
    // Get all ids of the servers
    const guild_ids = client.guilds.cache.map(guild => guild.id);
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashcommands = new Discord.Collection();


client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload)

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)

client.on("interactionCreate", (interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.inGuild()) return interaction.reply("This command can only be used in a server")

    const slashcmd = client.slashcommands.get(interaction.commandName)

    if (!slashcmd) return interaction.reply("Invalid slash command")

    if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perm))
        return interaction.reply("You do not have permission for this command")

        slashcmd.run(client, interaction)

})

module.exports = bot

//message logger
client.on('messageCreate', messageCreate => {
    console.log(`[${messageCreate.author.tag}]: ${messageCreate.content}`);
})

//deleted message logger
const logChannelID= "1018484190364319754"
  client.on("messageDelete", (messageDelete) => {
    client.channels.cache.get(logChannelID).send(`${messageDelete.author.tag}'s Message: "${messageDelete.content}" was deleted.`)
});

client.on("messageCreate", (message) => {
    if (message.content == "canyoupleasework"){
        message.reply("no")
    }
})


client.login(process.env.TOKEN);