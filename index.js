const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setPresence({ game: { name: `with banhammers | %help`, type: 0 } });
});

const prefix = "%";

const faces = [
  ";3", ":3", "o3o", "OwO", "owo", ":<", ":>", ":^)", "xD", "^~^", "^^", "^-^", "^_^"
]

client.on('guildBanAdd', (guild, user) => {
  if (!guild.channels.find('name', 'mod-log')) return
  guild.fetchAuditLogs({type: "MEMBER_BAN_ADD",limit: 1}).then(d => {
  let entry = d.entries.first();
  let mod = entry.executor;
  let punished = entry.target;
  guild.channels.find('name', 'mod-log').send('', {
    embed: {
      color: 0xbc1e1e,
      author: {
        name: mod.username,
        icon_url: mod.avatarURL
      },
      url: '',
      description: `**Action:** Ban\n**Target:** ${punished.username}#${punished.discriminator} (${punished.id})\n**Reason:** ${entry.reason}`,
      timestamp: new Date(),
      }
    });
})
});


client.on('guildBanRemove',(guild, user) => {
if (!guild.channels.find('name', 'mod-log')) return
guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE",limit: 1}).then(d => {
let entry = d.entries.first();
let mod = entry.executor;
let punished = entry.target;
guild.channels.find('name', 'mod-log').send('', {
  embed: {
    color: 0x0a7cd8,
    author: {
      name: mod.username,
      icon_url: mod.avatarURL
    },
    url: '',
    description: `**Action:** Unban\n**Target:** ${punished.username}#${punished.discriminator} (${punished.id})`,
    timestamp: new Date(),
    }
  });
});
});

client.on('message', message => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix + 'ping')) {
      message.channel.send("Pinging...").then(sent => {
          sent.edit(`Pong! (Took: ${sent.createdTimestamp - message.createdTimestamp}ms)`)
      })
  }

  if (message.content.startsWith(prefix + 'help')) {
      message.channel.send(`You've been DMed a help menu.`)
      message.author.send(`__**Commands**__\n\`\`\`
%ping > Checks if the bot is still alive.
%info > Gives bot statistics/information.
%help > Brings up this box.
%ban > Bans the specified user (MOD COMMAND)
%kick > Kicks the specified user (MOD COMMAND)
%warn > Warns the specified user (MOD COMMAND)
%say > Says the inputted arguments (DEV COMMAND)
%eval > Evaluates JavaScript code (DEV COMMAND)
%invite > Get the bot's invite url.
%nickname > Nicknames the bot (MOD COMMAND)
%randomface > Shows a random face.\`\`\``)
  }

  if (message.content.startsWith(prefix + 'info')) {
      message.channel.send(`Hello ${message.author.username}. I'm Snappa, a moderation bot that'll keep your discord server safe!\n
__**Stats:**__\`\`\`
Author: void#4938
Contributors: Nicki#8825
Library: discord.js
Total Emojis: ${client.emojis.size}
Total Servers: ${client.guilds.size}
Total Users: ${client.users.size}\`\`\``)
  }

  if (message.content.startsWith(prefix + 'ban')) {
    let userToBan = message.mentions.members.first()
    let reason = message.content.split(" ").slice(2).join(" ")
    let logChannel = message.guild.channels.find("name", "mod-log")

    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.channel.send("Uh oh! Looks like you don't have the required permissions to be able to execute this command.")
    } else if (!message.guild.member(client.user).permissions.has("BAN_MEMBERS")) {
      return message.channel.send("Uh oh! I don't have the required permissions to be able to execute this command.")
    }

    if (userToBan.id === client.user.id) {
      return message.reply("I can't ban myself.")
    }

    if (userToBan.id === message.author.id) {
      return message.reply("You can't ban yourself.")
    }

    if (!userToBan.bannable) {
      return message.reply("That user cannot be banned.")
    }

    if (message.mentions.users.size === 0) {
      return message.reply("Please mention the user that you'd like to ban.")
    }

    userToBan.ban()
    message.channel.send("Success!")
    logChannel.send('', {
        embed: {
          color: 0xbc1e1e,
          author: {
            name: message.author.tag,
            icon_url: message.author.avatarURL
          },
          url: '',
          description: `**Action:** Ban\n**Member:** ${userToBan.user.tag} (${userToBan.id})\n**Reason:** ${reason}`,
          timestamp: new Date(),
          }
        });
  }

  if (message.content.startsWith(prefix + 'kick')) {
    let userToKick = message.mentions.members.first()
    let reason = message.content.split(" ").slice(2).join(" ")
    let logChannel = message.guild.channels.find("name", "mod-log")

    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.channel.send("Uh oh! Looks like you don't have the required permissions to be able to execute this command.")
    } else if (!message.guild.member(client.user).permissions.has("KICK_MEMBERS")) {
      return message.channel.send("Uh oh! I don't have the required permissions to be able to execute this command.")
    }

    if (userToKick.id === client.user.id) {
      return message.reply("I can't kick myself.")
    }

    if (userToKick.id === message.author.id) {
      return message.reply("You can't kick yourself.")
    }

    if (!userToKick.kickable) {
      return message.reply("That user cannot be kicked.")
    }

    if (message.mentions.users.size === 0) {
      return message.reply("Please mention the user that you'd like to kick.")
    }

    userToKick.kick()
    message.channel.send("Success!")
    logChannel.send('', {
        embed: {
          color: 0xe57614,
          author: {
            name: message.author.tag,
            icon_url: message.author.avatarURL
          },
          url: '',
          description: `**Action:** Kick\n**Member:** ${userToKick.user.tag} (${userToKick.id})\n**Reason:** ${reason}`,
          timestamp: new Date(),
          }
        });
  }

  if (message.content.startsWith(prefix + 'say')) {
    if (!["229552088525438977", "298706728856453121", "356013659522072587"].includes(message.author.id)) return;
    let args = message.content.split(' ').slice(1).join(' ')
    message.delete();
    message.channel.send(`${args}`)
  }

  if (message.content.startsWith(prefix + 'eval')) {
    if(message.author.id !== "229552088525438977") return;
    let evall = message.content.split(' ')[0];
    let evalstuff = message.content.split(" ").slice(1).join(" ")
    try {
        const code = message.content.split(" ").slice(1).join(" ")
        let evaled = eval(code);
  
        if (typeof evaled !== 'string')
          evaled = require('util').inspect(evaled);
  
          const embed = new Discord.RichEmbed()
          .setTitle(`Evaluation:`)
  
          .setColor(0x1ab23b)
          .setDescription(`:inbox_tray: Input: \n \`\`\`${evalstuff}\`\`\` \n :outbox_tray: Output: \n  \`\`\`${clean(evaled)}\`\`\``)
  
        message.channel.send({embed});
      } catch (err) {
        const embed = new Discord.RichEmbed()
        .setTitle(`Evaluation:`)
  
        .setColor(0xb22f1a)
        .setDescription(`:inbox_tray: Input: \n \`\`\`${evalstuff}\`\`\` \n :outbox_tray: Output: \n  \`\`\`${clean(err)}\`\`\``)
  
        message.channel.send({embed});
      }
    }

    if (message.content.startsWith(prefix + 'invite')) {
      message.reply("You can invite using this link:\nhttps://discordapp.com/oauth2/authorize/?permissions=8&scope=bot&client_id=363246012862693376")
    }

    if (message.content.startsWith(prefix + 'warn')) {
      let userToWarn = message.mentions.members.first()
      let reason = message.content.split(" ").slice(2).join(" ")
      let logChannel = message.guild.channels.find("name", "mod-log")

      if (!message.member.permissions.has("KICK_MEMBERS")) {
        return message.channel.send("Uh oh! Looks like you don't have the required permissions to be able to execute this command.")
      } else if (!message.guild.member(client.user).permissions.has("KICK_MEMBERS")) {
        return message.channel.send("Uh oh! I don't have the required permissions to be able to execute this command.")
      }
  
      if (userToWarn.id === client.user.id) {
        return message.reply("I can't warn myself.")
      }

      if (userToWarn.id === message.author.id) {
        return message.reply("You can't warn yourself.")
      }

      if (!userToWarn.kickable) {
        return message.reply("That user cannot be warned.")
      }
  
      if (message.mentions.users.size === 0) {
        return message.reply("Please mention the user that you'd like to warn.")
      }

      message.channel.send("Success!")
      userToWarn.send(`You've been warned in **${message.guild.name}** for: "**${reason}**"`)
      logChannel.send('', {
          embed: {
            color: 0xffd800,
            author: {
              name: message.author.tag,
              icon_url: message.author.avatarURL
            },
            url: '',
            description: `**Action:** Warn\n**Member:** ${userToWarn.user.tag} (${userToWarn.id})\n**Reason:** ${reason}`,
            timestamp: new Date(),
            }
          });
    }

    if (message.content.startsWith(prefix + 'nickname')) {
      let args = message.content.split(" ").slice(1).join(" ")
      if (!message.member.permissions.has("MANAGE_NICKNAMES")) {
        return message.channel.send("Uh oh! Looks like you don't have the required permissions to be able to execute this command.")
      } else if (!message.guild.member(client.user).permissions.has("CHANGE_NICKNAME")) {
        return message.channel.send("Uh oh! I don't have the required permissions to be able to execute this command.")
      }

      if (!args) {
        return message.reply("You didn't provide arguments.")
      }

      message.channel.send(`My nickname is now: ${args}`).then(message.guild.member(client.user).setNickname(`${args}`));
    }

    if (message.content.startsWith(prefix + 'randomface')) {
      message.channel.send(`${faces[Math.floor(Math.random() * faces.length)]}`)
    }
});

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

client.login('your token here');
