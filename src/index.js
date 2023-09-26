import Alpaca from "@alpacahq/alpaca-trade-api";

import { Client, IntentsBitField } from 'discord.js';

import dotenv from 'dotenv';
import express from 'express';

import {RateLimiter, isTimeWithinTradingHours} from "./utils.js";
import {getBuyingPower, createOrder, displayPortfolioDetails} from "./alpaca-api-module.js";


const app = express();
const port = 3000;

const botToken = process.env.TOKEN;
const apiKey = process.env.API_KEY_ID;
const apiSecretKey = process.env.API_SECRET_KEY

const alpaca = new Alpaca({
    keyId: apiKey,
    secretKey: apiSecretKey,
    paper: true,
});

const limiter = new RateLimiter(200, 60 * 1000);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

var blocked = false;

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
// set up HTTP port for free server. Hosted for free on REPL using UptimeRobot loophole.

dotenv.config();

alpaca.getAccount().then((account) => {
    // Check if our account is restricted from trading.
    if (account.trading_blocked) {
        console.log("Account is currently restricted from trading.");
        blocked = true;
    } else {
        blocked = false;
    }

    // Check how much money we can use to open new positions.
    console.log(`$${account.buying_power} is available as buying power.`);
});


client.on('ready', (c) => {
    console.log("booting up bot")
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (limiter.allowRequest()) {

        if (interaction.commandName === "cash") {
            getBuyingPower(alpaca, blocked).then(buyingPower => {
                if (buyingPower !== null) {
                    let outString = ""
                    outString += `**TOTAL BP:** \`\`\`elm\n$ ${buyingPower[0]}\`\`\`\n`;
                    outString += `**TOTAL CASH:** \`\`\`elm\n$ ${buyingPower[1]}\`\`\`\n`;

                    interaction.reply(outString);
                    return;
                }
            });
        }

        else if (interaction.commandName === "portfolio") {
            displayPortfolioDetails(alpaca, interaction);
            return;
        }

        else if (isTimeWithinTradingHours()) {
            if (blocked) {
                interaction.reply("TRADING RESTRICTED");
                return;
            }
            if (interaction.commandName === "buy") {

                try {
                    var stonk = interaction.options.get('ticker').value;
                    createOrder(alpaca, 'buy', stonk.toUpperCase(), interaction);
                } catch (error) {
                    console.log(`error occured ${error}`)
                }
            }
            if (interaction.commandName === "sell") {

                try {
                    var stonk = interaction.options.get('ticker').value;
                    createOrder(alpaca, 'sell', stonk.toUpperCase(), interaction);
                    return;
                } catch (error) {
                    console.log(`error occured ${error}`)
                }
            }

        } else {
            interaction.reply("market is currently closed!");
            return;
        }

    } else {
        // Rate limit has been exceeded
        interaction.reply("Rate limit exceeded! Try again later");
        return;
    }
})


client.login(botToken);
