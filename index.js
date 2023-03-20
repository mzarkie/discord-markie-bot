import {Client, Events, Collection, GatewayIntentBits} from "discord.js"
import "dotenv/config"
import fs from "fs"

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
  ]
})

client.commands = new Collection();
const commandsPath = "./commands"
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".cjs"))

for (const file of commandFiles) {
    const filePath = commandsPath + "/" + file;
    import(filePath)
        .then(obj => {
            if ("data" in obj.default && "execute" in obj.default) {
                client.commands.set(obj.default.data.name, obj.default)
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
        })
}

client.on("ready", () => {
    console.log("The Markie Bot is now online.");
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command!",
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true
            })
        }
    }
})

client.login(process.env.DISCORD_TOKEN)