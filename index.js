require('dotenv').config(); // Add this line to load environment variables from .env file

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const { Client, Intents } = require('discord.js');

// Create an Express application
const app = express();
const port = 3000; // Change the port as needed

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Discord bot setup
const discordToken = process.env.DISCORD_TOKEN; // Retrieve token from environment variable
if (!discordToken) {
    console.error("Discord token not found. Make sure you have set up your .env file properly.");
    process.exit(1); // Exit the process if token is not found
}

// Define your intents
const intents = new Intents([
    Intents.FLAGS.GUILDS, // This intent is required for all bots
    Intents.FLAGS.GUILD_MESSAGES // This intent is required to receive message events
]);

const client = new Client({ intents });
client.login(discordToken);

const channelId = "1216379204837441566";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Express route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, link, imageLink } = req.body;

    // Send the three parts of the message to Discord channel
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            await channel.send(`⭐ ${name} ⭐\n\n👉 ${link}`);
            await channel.send(imageLink);
            await channel.send(`------------------------------------------------`);
            console.log('Messages sent successfully');
            res.redirect('/');
        } else {
            console.error('Channel not found');
            res.status(404).send('Channel not found');
        }
    } catch (error) {
        console.error('Error sending messages:', error);
        res.status(500).send('Error sending messages');
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
