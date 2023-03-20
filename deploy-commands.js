import { REST } from "discord.js"
import { Routes } from "discord-api-types/v9"
import "dotenv"
import fs from "fs"

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = "./commands"
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cjs'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    await import(`./commands/${file}`)
        .then(obj => {
            commands.push(obj.data.toJSON())
        })
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.delete(Routes.applicationGuildCommand("1087421006542553201", "1077612561056399500", '1087431535822639196'))
            .then(() => console.log('Successfully deleted guild command'))
            .catch(console.error);

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();