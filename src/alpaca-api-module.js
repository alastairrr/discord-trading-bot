
export async function getBuyingPower(alpaca) {
    try {
        const account = await alpaca.getAccount();
        if (account.trading_blocked) {
            blocked = true;
        } else {
            blocked = false;
        }
        return [account.buying_power, account.cash];
    } catch (error) {
        console.error('An error occurred:', error.message);
        return [0, 0];
    }
}

export async function createOrder(alpaca, side, stock, interaction) {
    console.log(`${side} ${stock}`)
    try {

        await alpaca.createOrder({
            symbol: stock,
            qty: 1,
            side: side,
            type: 'market',
            time_in_force: 'day'
        });

        interaction.reply(`\`\`\`elm\nORDER FILLED - ${side.toUpperCase()} $${stock}\`\`\``);

    } catch (error) {
        console.log(error.response.status)
        if (error.response.status === 404 || error.response.status === 422) {
            interaction.reply(`can't trade '${stock}'!`);
        } else {
            console.error('An error occurred:', error.message);
            interaction.reply(`${error.response.status} api error or trading restricted (PDT/BAN). check console.`);
        }
    }
}

export async function displayPortfolioDetails(alpaca, interaction) {
    let outString = ""

    try {
        let positions = await alpaca.getPositions();

        let totalGainLoss = 0;
        let totalPortVal = 0;
        for (const position of positions) {
            totalGainLoss += parseFloat(position.unrealized_pl);
            totalPortVal += parseFloat(position.market_value);
        }

        if (positions.length === 0) {
            outString += `**TOTAL VALUE:** \`\`\`elm\n$ ${totalPortVal.toFixed(2)}\`\`\`\n`;
            outString += "\n**PORTFOLIO:**\n\`\`\`elm\n";
            outString += "NO POSITIONS FOUND\`\`\`";
            interaction.reply(outString)

            return;
        }

        outString += `**TOTAL EQUITY VALUE:** \`\`\`elm\n$ ${totalPortVal.toFixed(2)}\`\`\`\n`;

        outString += `**GAIN/LOSS:** \`\`\`diff\n${totalGainLoss > 0 ? '+' : '-'} $${(Math.abs(totalGainLoss)).toFixed(2)}\`\`\``;
        outString += "\n**PORTFOLIO:**\n\`\`\`elm\n";

        positions = positions.sort((a, b) => parseFloat(b.market_value) - parseFloat(a.market_value));
        for (const position of positions) {
            const percentageOfPortfolio = ((parseFloat(position.market_value) / parseFloat(totalPortVal)) * 100).toFixed(2);
            const gainLoss = position.unrealized_pl;

            outString += `${position.side.toUpperCase()}\t${position.symbol}\t‖\t${position.qty} ${position.qty > 1 ? 'UNITS' : 'UNIT'}\t❙\t${percentageOfPortfolio}% OF PORT\t❙\t${gainLoss > 0 ? '▲ ' : '▼ '} $ ${position.market_value} MKT VALUE\t❙\t${gainLoss > 0 ? '+ ' : '- '}$ ${(Math.abs(gainLoss)).toFixed(2)} VAL CHG\n`;
        }
        outString += "\`\`\`"
        interaction.reply(outString)

    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}
