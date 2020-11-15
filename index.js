const { Client, Collection } = require('discord.js');

const client = new Client();
client.commands = new Collection();

require('./handlers/events').init(client);
require('./handlers/commands').init(client);

client.login(require('./config.json').token);
