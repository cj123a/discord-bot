require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

// Validate environment variables
if (!process.env.TOKEN) {
  console.error("❌ ERROR: TOKEN not found in .env file");
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error("❌ ERROR: CLIENT_ID not found in .env file");
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Start verification process"),
  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup verification message in a selected channel")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel where the verification message will be posted")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🔄 Registering slash commands...");
    
    let route;
    let deployType;
    
    // Use guild-specific if GUILD_ID is set, otherwise use global
    if (process.env.GUILD_ID && process.env.GUILD_ID !== "YOUR_TEST_SERVER_ID_HERE") {
      route = Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID);
      deployType = `Guild: ${process.env.GUILD_ID}`;
    } else {
      route = Routes.applicationCommands(process.env.CLIENT_ID);
      deployType = "Global (takes 1-2 hours)";
    }
    
    const result = await rest.put(route, { body: commands });
    
    console.log(`✅ Successfully registered ${result.length} command(s)`);
    console.log(`📍 Deployment: ${deployType}`);
    console.log(`✨ Available commands: ${result.map(cmd => `/${cmd.name}`).join(", ")}`);
    
  } catch (error) {
    console.error("❌ Error registering commands:", error.message);
    if (error.code === 50001) {
      console.error("   → Bot missing permissions. Check bot has 'applications.commands' scope");
    }
    process.exit(1);
  }
})();