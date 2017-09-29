const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({ game: { name: `%help and %info`, type: 0 } });
});

const prefix = "%";

client.on('message', message => {
  if (message.content.startsWith(prefix + 'ping')) {
      message.channel.send("Pinging...").then(sent => {
          sent.edit(`Pong! (Took: ${sent.createdTimestamp - message.createdTimestamp}ms)`)
      })
  }

  if (message.content.startsWith(prefix + 'help')) {
      message.channel.send(`You've been DMed a help menu!`)
      message.author.send(`__**Commands**__\n\`\`\`
%ping > Checks if the bot is still alive.
%info > Gives bot statistics/information\`\`\``)
  }

  if (message.content.startsWith(prefix + 'info')) {
      message.channel.send(`Hello ${message.author.username}. I'm Snappa, a moderation bot that'll keep your discord server safe!\n
__**Stats:**__\`\`\`
Library: discord.js
Total Emojis: ${client.emojis.size}
Total Servers: ${client.guilds.size}
Total Users: ${client.users.size}\`\`\``)
  }
});

client.login(process.env.BOT_TOKEN);
