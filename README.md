<div align="center">

# Currency/EXP Bot

[Installation](#Installation) • [How to Use](#How-to-Use) • [Commands](#Commands)

---

## Installation

</div>

##### Prerequisite

- To use this bot, Node.js 12.0.0 or newer must be [installed](https://nodejs.org/en/download/).

##### Downloading and installing steps

1.  **[Download](https://github.com/jay1934/Minigame-Bot/archive/main.zip)** the `zip` file.

2.  Configure the Bot:

    - Run `npm i`
    - You will need to [create a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) in the **[developers space](https://discordapp.com/developers/applications/me)**
    - Enable both Priviledged Intents

3.  Invite the Bot to your Server:

    - In your bot's application page, navigate to [OAUTH2](https://discord.com/developers/applications/771430839250059274/oauth2)
    - In the "scopes" section, select `bot`
    - In the "bot permission" section, select:

      - `ADMINISTRATOR`

      This will account for permissions needed on all three features.

    - Copy and paste the generated invite link!

4.  Get the Bot Online
    - Run `node index.js`
    - **The bot is now operational ! 🎉**

<br>

---

<div align="center">

## How to Use

</div>

First, you need to fill in all of the values in [`config.json`](/config.json). In this case, it's just your bot token. You're basically all set! This bot works out of the box thanks to the JSON file databases.

---

<div align="center">

## Commands

```
[] - Optional
<> - required
```

| Name  |            Usage             |                      Description                       |
| :---: | :--------------------------: | :----------------------------------------------------: |
| Image |           `+image`           |            Generate a random axolotl image             |
| Help  |           `+help`            | Get a list of commands (and keep track of usage count) |
| Role  | `+role <@role or role name>` |         Give yourself a role that is below you         |
| Fight |     `+fight <@mention>`      |             Create a new fighting minigame             |

</div>
