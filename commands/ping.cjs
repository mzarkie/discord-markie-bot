const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    async execute(interaction) {
        await interaction.reply({
            content: `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`,
            ephemeral: true
        })
    }
}
