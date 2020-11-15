module.exports = {
  match: '(add)?role',
  execute(message, name) {
    const err = (error) =>
      message.channel
        .send(`:x: ${error}`)
        .then((msg) => msg.delete({ timeout: 4000 }));

    if (!name[0]) return err('You need to provide the name of the role to add');

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find(
        (role) => role.name.toLowerCase() === name.join(' ').toLowerCase()
      );

    if (!role) return err(`\`${name.join(' ')}\` is not a valid role name`);
    if (message.member.roles.cache.has(role.id))
      return err('You already have this role!');
    if (
      role.position > message.member.roles.highest &&
      !message.member.hasPermission('ADMINISTRATOR')
    )
      return err("You can't assign yourself a role that is above you!");
    if (role.position >= message.guild.me.roles.highest.position)
      return err('That role is above me! Please contact an administrator');
    if (role.managed) return err("I can't assign bot roles!");

    try {
      message.member.roles.add(role);
      message.channel.send(`I gave you the \`${role.name}\` role!`);
    } catch (e) {
      err("I can't assign that role");
    }
  },
};
