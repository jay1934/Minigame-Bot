const { MessageEmbed } = require('discord.js');
const { progressbar } = require('discord.js-utility');
const fs = require('fs');
const Player = require('./Player');

module.exports = class Fight {
  constructor(first, second, channel) {
    Object.assign(this, {
      players: [new Player(first, this), new Player(second, this)],
      channel,
    });
  }

  startTurn(player) {
    if (this.message) this.message.delete();
    this.channel
      .send(
        new MessageEmbed()
          .setColor('GREEN')
          .setTitle(`${player.user.tag}, it's your turn!`)
          .addFields([
            ...[player, player.second].map((player) => ({
              name: `${player.user.tag}'s Health`,
              value: `${progressbar(
                player.health,
                player.health > 101 ? player.health : 101,
                5,
                [':heart:', '-'],
                false
              )} ${player.health}`,
            })),
            {
              name: 'Actions',
              value: `:crossed_swords: - Attack (deal 1-100 points of damage)\n:heart: - Heal (regenerate 1-60 health points)\n:dash: - Flee (end the game at the price of your honor :confused:)`,
            },
          ])
          .setFooter('Please react within 2 minutes, or the game will end')
      )
      .then(async (message) => {
        this.message = message;
        await message.react('⚔️');
        await message.react('❤️');
        await message.react('💨');
        const collected = await message.awaitReactions(
          (reaction, user) =>
            ['⚔️', '❤️', '💨'].includes(reaction.emoji.name) &&
            user.id === player.user.id,
          { max: 1, time: 120000, errors: ['time'] }
        );

        switch (collected.first().emoji.name) {
          case '⚔️':
            return player.attack();
          case '❤️':
            return player.heal();
          case '💨':
            return player.flee();
        }
      })
      .catch(() => this.close('time', player.second));
  }

  close(reason, winner) {
    this.message.delete();
    switch (reason) {
      case 'fight': {
        fs.writeFileSync(
          './data/fights.json',
          JSON.stringify(
            {
              ...JSON.parse(fs.readFileSync('./data/fights.json')),
              [winner.user.id]: winner.wins + 1,
            },
            '',
            2
          )
        );
        this.channel.send(
          new MessageEmbed()
            .setColor('BLUE')
            .setTitle(
              `With a mighty blow, ${winner.user.username} strikes down ${winner.second.user.username}, and their health reaches zero. GG :tada:`
            )
            .setFooter(`${winner.user.username} now has ${winner.wins} wins`)
        );
        break;
      }

      case 'time': {
        fs.writeFileSync(
          './data/fights.json',
          JSON.stringify(
            {
              ...JSON.parse(fs.readFileSync('./data/fights.json')),
              [winner.user.id]: winner.wins + 1,
            },
            '',
            2
          )
        );

        this.channel.send(
          new MessageEmbed()
            .setColor('BLUE')
            .setTitle(
              `${winner.second.user.username} did not react in time, and has thus forfeited the round. What an embarrassing way to go :clock1:`
            )
            .setFooter(`${winner.user.username} now has ${winner.wins} wins`)
        );

        break;
      }
      case 'flee': {
        fs.writeFileSync(
          './data/fights.json',
          JSON.stringify(
            {
              ...JSON.parse(fs.readFileSync('./data/fights.json')),
              [winner.user.id]: winner.wins + 1,
            },
            '',
            2
          )
        );
        break;
      }
    }

    if (winner.wins === 100) {
      this.channel.send(
        `Congratulations ${winner.user}! You won 100 games, and have earned the \`Royal Guard\` role!`
      );
      this.channel.guild
        .member(winner.user)
        .roles.add(
          this.channel.guild.roles.cache.find(
            (role) => role.name === 'Royal Guard'
          )
        );
    } else if (winner.wins === 1000) {
      this.channel.send(
        `Congratulations ${winner.user}! You won 1000 games, and have earned the \`Genocider\` role!`
      );
      this.channel.guild
        .member(winner.user)
        .roles.add(
          this.channel.guild.roles.cache.find(
            (role) => role.name === 'Genocider'
          )
        );
    }
  }
};
