const tmi = require('tmi.js');
const http = require('http');
const express = require('express');

const path = require('path');
const app = express();
app.use(express.json());

// Main object that tracks the queue
QUEUE = [];

const CHANNEL_NAME = "TODO"; // Change TODO to your channel name

// Define configuration options
const opts = {
  identity: {
      username: "TODO", // Change TODO to the name of the bot or account you want to be used to reply as queue manager
      password: "TODO" // Change TODO to the above username's oath token. To get oath token go to https://twitchapps.com/tmi/ while logged into the account you want to use as queue manager
  },
  channels: [
    CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim();
    const username = context.username;

    console.log(context);

    // If the command is known, let's execute it
    if (commandName === '!queue') {
        client.say(target, `!joinqueue - join the queue | !queueposition - check your position in the queue | !leavequeue - leave the queue`);
    } else if (commandName === '!joinqueue') {
        addToQueue(target,context, username);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!queueposition') {
        getUserPosition(target, context);
    } else if (commandName === '!leavequeue') {
        leaveQueue(context);
    } else if (commandName === '!next') {
        if (username === CHANNEL_NAME){
            getNextInQueue(target);
            console.log(`* Executed ${commandName} command`);
        } else {
            client.say(target, `! Sorry ${username} you don't have permissions to run that command.`);
        }
    }
}

function addToQueue(target, context,user){
    const userIndex = QUEUE.indexOf(user);
    // user not in queue yet
    if (userIndex < 0){
      QUEUE.push(user);
        client.say(target, `${context.username} has been added to the queue. ${getQueuePositionMessage(QUEUE.indexOf(user), true)}`);
    } else {
      client.say(target, `@${context.username}, you are already in the queue. ${getQueuePositionMessage(userIndex)}`);
    }
}

function leaveQueue(context) {
    const userIndex = QUEUE.indexOf(context.username);

    QUEUE.splice(userIndex, 1);
}

function getQueuePositionMessage(userIndex, newlyAdded = false){
   if (userIndex === 0) {
       return newlyAdded ? `You are next in line.` : `Don't worry, you're next though.`;
   } else if (userIndex === 1) {
       return `There's one person ahead of you.`;
   } else {
       return `There are ${userIndex} people in front of you.`;
   }
}

function getNextInQueue(target) {
    if (QUEUE.length > 0){
        const user = QUEUE.shift();
        try {
            client.say(target, `@${user} You're up! You joined the queue and it's now your turn.`);
        } catch(e) {
            console.log(e);
        }
    }
}

function getUserPosition(target, context) {
    const user = context.username;
    const userIndex = QUEUE.indexOf(user);

    if (userIndex === 0){
      client.say(target, `@${user}, you're next.`);
    } else if (userIndex > -1) {
        client.say(target, `@${user}, you have ${userIndex} people in front of you.`);
    } else {
        client.say(target, `@${user}, you are not in queue. Send !joinqueue to chat to join the queue.`)
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Express Middleware for serving static files
app.use(express.static(path.join(__dirname+'/public')));

app.get('/queue', (req, res) => {
  res.send(QUEUE);
});

app.put('/queue/:username', (req, res) => {
  const username = req.params.username;
  let message = "added";
  userIndex = QUEUE.indexOf(username);

  if (userIndex < 0) {
    QUEUE.push(username);
  } else {
    message = "already added";
  }

  res.send({
    queue: QUEUE,
    message,
  });
});

app.delete('/queue/:username', (req, res) => {
  const username = req.params.username;
  const userIndex = QUEUE.indexOf(username);
  if (userIndex > -1) {
    QUEUE.splice(userIndex, 1);
  }
  
  res.send(QUEUE);
});

app.get('/next', (req, res) => {
  console.log("calling next");
  const player = QUEUE.shift();
  console.log("next", player);
  res.send({queue: QUEUE, player});
});

app.get('/position/:username', (req, res) => {
  let index = -1;
  const username = req.params.username;
  if (username){
    index = QUEUE.indexOf(req.params.username);
  }
  res.send({index});
});

app.use('/', function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to your project folder.
});

// default URL for website
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);