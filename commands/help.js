const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  match: 'help',
  execute(message) {
    const entries = JSON.parse(fs.readFileSync('./data/helps.json'));
    fs.writeFileSync(
      './data/helps.json',
      JSON.stringify(
        {
          ...entries,
          [message.author.id]: (entries[message.author.id] || 0) + 1,
        },
        '',
        2
      )
    );
    message.channel.send(
      new MessageEmbed()
        .setTitle('All Commands')
        .setColor('RANDOM')
        .addFields([
          { name: '`-axo image`', value: 'Generate a random axolotl image' },
          {
            name: '`-axo role <name>`',
            value: 'Give yourself any role that is below you',
          },
          {
            name: '`-axo fight @mention`',
            value: 'Play a fighting minigame with someone',
          },
        ])
    );

    if (entries[message.author.id] + 1 === 50) {
      message.channel.send(
        `Congrats on using the \`-axo help\` command 50 times! You've earned the \`Lost\` role :stuck_out_tongue:`
      );
      message.member.roles.add(
        message.guild.roles.cache.find((role) => role.name === 'Lost')
      );
    }
  },
};
