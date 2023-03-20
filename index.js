import { Client, GatewayIntentBits }  from "discord.js"
import "dotenv/config"

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
    console.log("The Markie Bot is now online.");
    // Guild Commands
    const testGuildId = "1077612561056399500";
    const guild = client.guilds.cache.get(testGuildId);
    let commands
    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }
    commands?.create({
        name: "ping",
        description: "Replies with pong.",
    })
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options } = interaction

    let { execute } = await import(`./commands/${commandName}.js`)

    execute(interaction)
})

client.login(process.env.DISCORD_TOKEN)