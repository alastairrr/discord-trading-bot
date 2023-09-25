import { REST, Routes } from 'discord.js';
const botToken = process.env.TOKEN;
const botID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

const commands = [
  {
    name: "buy",
    description: "buy one unit of stock",
    options: [{
      name: "ticker", // no uppercase as well
      description: "ticker of stonk",
      type: 3
    }]
  },
  {
    name: "sell",
    description: "sell one unit of stock",
    options: [{
      name: "ticker", // no uppercase as well
      description: "ticker of stonk",
      type: 3
    }]
  },
  {
    name: "portfolio",
    description: "shows current portfolio",
  },
  {
    name: "cash",
    description: "shows current buying power and cash",
  },
];

const rest = new REST({ version: '10' }).setToken(botToken);

(async () => {
  try {
    console.log('Registering slash commands');
    await rest.put(
      Routes.applicationGuildCommands(botID, guildID),
      { body: commands }
    )

    console.log('Slash commands registered correctly');
  } catch (error) {
    console.log(error);
  }
})();