const { MessageEmbed } = require('discord.js');

module.exports = class Player {
  constructor(user, fight) {
    Object.assign(this, {
      health: 101,
      fight,
      user,
    });
  }

  get second() {
    return this.fight.players.find(({ user }) => user.id !== this.user.id);
  }

  get wins() {
    return (
      JSON.parse(require('fs').readFileSync('./data/fights.json'))[
        this.user.id
      ] || 0
    );
  }

  attack() {
    const amount = ~~(Math.random() * 100 + 1);
    this.second.health -= amount;
    this.fight.channel.send(
      new MessageEmbed()
        .setColor('RED')
        .setTitle(
          `${
            amount <= 20
              ? `${this.second.user.username} dodged, so ${this.user.username}'s attack only inflicted`
              : amount <= 50
              ? `${this.second.user.username} tried to ${
                  ['sidestep', 'jump over', 'duck under'][~~(Math.random() * 3)]
                } ${
                  this.user.username
                }'s attack so it barely hit, but they still inflicted`
              : amount <= 75
              ? `${
                  ['Nice', 'Accurate', 'Strong'][~~(Math.random() * 3)]
                } hit! ${this.user.username}'s attack inflicted`
              : `CRITICAL HIT :fire:! ${this.user.username}'s attack inflicted a whopping`
          } ${amount} points of damage :crossed_swords:`
        )
    );
    if (this.second.health <= 0) return this.fight.close('fight', this);
    this.fight.startTurn(this.second);
  }

  heal() {
    const amount = ~~(Math.random() * 60 + 1);
    this.health += amount;
    const adjective = [
      'curative',
      'therapeutic',
      'restorative',
      'corrective',
      'remedial',
      'medicinal',
      'sanative',
    ][~~(Math.random() * 7)];
    const food = [
      'taco',
      'chicken noodle soup',
      'salad',
      'lasagna',
      'cheeto',
      'carrot',
      "slice o' cheese",
    ][~~(Math.random() * 6)];
    this.fight.channel.send(
      new MessageEmbed()
        .setColor('GREEN')
        .setTitle(
          `${
            amount <= 10
              ? `${this.user.username} tripped on a ${
                  ['twig', 'nearby shoe', 'rock', 'bush'][~~(Math.random * 4)]
                } while eating your ${adjective} ${food}, so they only healed`
              : amount <= 20
              ? `${this.user.username}'s ${adjective} ${food} was a bit undercooked in the middle, but they still healed a fair`
              : amount <= 40
              ? `That must truly be a ${adjective} ${food} worthy of the gods. ${this.user.username} healed`
              : `It's culinary paradise! ${this.user.username}'s ${adjective} ${food} healed an unmatched`
          } ${amount} points of damage :heart:`
        )
    );
    this.fight.startTurn(this.second);
  }

  flee() {
    this.fight.channel.send(
      new MessageEmbed()
        .setColor('BLUE')
        .setTitle(
          `${this.user.username} sacrificed their pride and ran from a fight! ${this.second.user.username} wins this match :crossed_swords:`
        )
        .setFooter(
          `${this.second.user.username} now has ${this.second.wins + 1} wins`
        )
    );
    this.fight.close('flee', this.second);
  }
};
