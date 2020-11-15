const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  match: '(image|img)',
  async execute(message) {
    const entries = JSON.parse(fs.readFileSync('./data/images.json'));
    fs.writeFileSync(
      './data/images.json',
      JSON.stringify(
        {
          ...entries,
          [message.author.id]: (entries[message.author.id] || 0) + 1,
        },
        '',
        2
      )
    );

    const { source, url } = JSON.parse(fs.readFileSync('./data/axolotls.json'))[
      ~~(Math.random() * 200)
    ];

    message.channel.send(
      new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Source')
        .setURL(source)
        .setImage(url)
    );

    if (entries[message.author.id] + 1 === 100) {
      message.channel.send(
        `Congratulations ${message.author}, you've used the \`-axo image\` command 100 times and have earned the \`Axolotl Lover\` role!`
      );
      message.member.roles.add(
        message.guild.roles.cache.find((role) => role.name === 'Axolotl Lover')
      );
    }
  },
};
