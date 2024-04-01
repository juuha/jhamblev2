const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const init_emojis = require("./functions/init_emojis");

const client = new Client({ 
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	client.user.setActivity('/help', { type: ActivityType.Listening });
});

client.on(Events.InteractionCreate, async (interaction, user) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client, user);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	// Fetch partial reaction.
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			return;
		}
	}

	if (user.id === client.user.id) return;

	const emojis = await init_emojis(client);
	const embed = reaction.message.embeds[0];

	if (reaction.message.author.id === client.user.id) {
		// Only handle reaction based commands if used on gamble messages, where the embed color is either red or green.
		if (embed.color == 0x9FE2BF || embed.color == 0xff7f7f) {
            let count = 1;
            let command = "gamble";
			let emoji = reaction.emoji.id ? reaction.emoji : reaction.emoji.name;

			switch (emoji) {
				case emojis.ecto:
				case "🎲":
					count = 1;
					break
				case emojis.glob:
				case "🔅":
					count = 2;
					break;
				case emojis.crystal:
				case "💎":
					count = 5;
					break;
				case emojis.asc_glob:
				case "🔆":
					count = 10;
					break;
				case emojis.orb:
				case "🔮":
					count = 20;
					break;
				case "⚖️":
					command = "balance";
					break;
				default:
					return;
			}
			
            let globalName = embed.data.description.split("\n")[0];
            globalName = globalName.substring(0, globalName.length - 10);
			let stolen_message = false;
			if (user.globalName != globalName) {
				stolen_message = true;
			}

            const reactionUserManager = reaction.users;
            try {
                await reactionUserManager.remove(user);
            } catch (error) { console.error(error) }
            
			switch (command) {
				case "gamble":
					client.commands.get('gamble').execute(reaction, client, inside_job = true, count, user, stolen_message);
					break;
				case "balance":
					client.commands.get('balance').execute(reaction, client, inside_job = true, user, stolen_message)
					break;
				default:
					return;
			}
            
        }
	}	
});

client.login(token);
