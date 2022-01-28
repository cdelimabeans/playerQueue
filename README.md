# Twitch Player Queue

***NOTE**: This project is using localhost to display player queue*

## Overview
Player queue allows users to join a queue by entering specific commands in your chat.

![Chat sample](/assets/chat_sample.png)

You can also choose to display the player queue in your stream by adding `http://localhost:3000` as a Browser source.

![Queue](/assets/queue.png)

*Screenshot shows background as white but when streaming, it will be transparent.*

## How to use
This code will not work out of the box. Follow set-up instructions before running the code.

### Set-up
**Step 1**: [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this repo.

```
git clone https://github.com/cdelimabeans/playerQueue.git
```

**Step 2**: Open `public/js/index.js` and change all instances of `TODO`.

```js
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
```

**Step 3**: Do the same for `server.js`.

```js
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
```

**Step 4**: Open terminal and go to whichever directory the player queue code is located.

- **On Mac**: Spotlight search for "Terminal"
- **On Windows**: Follow [guide](https://docs.microsoft.com/en-us/windows/terminal/install#:~:text=You%20can%20invoke%20most%20features,menu%20in%20Windows%20Terminal%20Preview.)

**Step 5**: Run `npm install` then `npm run dev` (make sure [node.js](https://nodejs.org/en/) is installed).

## Customization

By default player queue is styled to match Pokemon Unite. You can customized your queue by updating `public/css/index.css`.