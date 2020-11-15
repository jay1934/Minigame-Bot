const { MessageEmbed } = require('discord.js');
const Fight = require('../classes/Fight');

module.exports = {
  match: 'fight',
  execute(message) {
    const err = (error) =>
      message.channel
        .send(`:x: ${error}`)
        .then((msg) => msg.delete({ timeout: 4000 }));

    const user = message.mentions.users.first();
    if (!user) return err('You need to mention a user to play with!');

    if (user.bot) return err("You can't play with a bot!");

    if (user.id === message.author.id)
      return err("You can't play with yourself!");

    return message.channel
      .send(
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle(`${user.tag}, would you like to play?`)
      )
      .then(async (msg) => {
        await msg.react('✅');
        await msg.react('❌');
        msg
          .awaitReactions(
            (reaction, exec) =>
              exec.id === user.id && ['✅', '❌'].includes(reaction.emoji.name),
            { max: 1, time: 300000, errors: ['time'] }
          )
          .then((collected) => {
            msg.delete();
            if (collected.first().emoji.name === '✅') {
              message.channel
                .send(
                  `${message.author} ${user} Flipping a coin to see who goes first :coin:!`
                )
                .then((msg) => {
                  setTimeout(() => {
                    const num = Math.random() > 0.5 ? 0 : 1;
                    msg.edit(`I flipped ${num ? 'heads' : 'tails'} :coin:!`);
                    const game = new Fight(
                      user,
                      message.author,
                      message.channel
                    );
                    game.startTurn(game.players[num]);
                  }, 2000);
                });
            } else message.channel.send(`Unfortunately, ${user.tag} declined`);
          })
          .catch(() => {
            msg.delete();
            msg.channel.send(
              `${user.tag} didn't respond in 5 minutes. Game canceled.`
            );
          });
      });
  },
};
