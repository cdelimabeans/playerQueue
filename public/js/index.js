const CHANNEL_NAME = "TODO"; // Change TODO to your channel name

// For instructions on how to set up client, go to https://dev.twitch.tv/docs/irc
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: [CHANNEL_NAME],
    identity: {
        username: 'TODO', // Change TODO to the name of the bot or account you want to be used to reply as queue manager
        password: 'TODO' // Change TODO to the above username's oath token. To get oath token go to https://twitchapps.com/tmi/ while logged into the account you want to use as queue manager
    },
});

client.connect().then(() => {
    // Fetch queue as soon as client gets connected
    fetch('/queue').then(response => {
        return response.json();
    }).then(queue => {
        render(queue);
    });

    console.log(`Listening for messages in ${CHANNEL_NAME}...`);
});

// Need to listen to chat so page can reload immediately. Sometimes browser sources won't update unless the page gets reload
client.on('message', (target, context, commandName, self) => {
    if (self) return;
    const { username } = context;

    // For every valid command, immediately reload the page
    if (commandName === '!queue' || 
        commandName === '!joinqueue' || 
        (commandName === '!next' && username === CHANNEL_NAME) ||
        commandName === '!leavequeue' ||
        commandName.includes('been added to the ranked queue')
    ) {
            location.reload();
    }
  });

function render(queue) {
    let playerQueueEl = document.getElementById("player-queue");
    let innerHTML = '';

    // Max number of rows to show in the queue. 
    // If there are more people in the queue than the max row,
    // the last row will be replaced with the "And n other players" message
    const MAX_ROWS = 5;
    
    for (let i = 0; i < MAX_ROWS; i++) {
        const player = queue[i];
        if (player){
            innerHTML += `<p class="player">${player}</p>`;
        }
    }

    const len = queue.length;
    if (len > MAX_ROWS){
            innerHTML += `<p class="player">And ${len - MAX_ROWS} other player${len - MAX_ROWS === 1 ? '': 's'}</p>`;
        
    }

    playerQueueEl.innerHTML = innerHTML;
}