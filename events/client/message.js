module.exports = (message) => {
  if (
    !message.guild ||
    message.author.bot ||
    !message.content.startsWith('-axo ')
  )
    return;
  const args = message.content.slice(5).split(/ +/);
  const name = args.shift();
  const command = message.client.commands.find((_, match) =>
    new RegExp(`^${match}$`).test(name)
  );

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (e) {
    message.channel.send(':x: Something went wrong');
    console.log(e);
  }
};
