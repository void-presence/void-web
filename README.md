<img width="3844" height="793" alt="484064966-2c662772-bca231-4de4-988f-5304d7dfd87d" src="https://github.com/user-attachments/assets/eea692df-b300-45de-8acb-03ab75cfdf3c" />

##

Void Presence Web is the web interface for **Void Presence** – a service for browsing, sharing, and using community-made Discord Rich Presence configs.

## Features

- View detailed information about a config (cycles, buttons, images).
- Rich preview of the Discord Rich Presence card.
- Download config as a `JSON` file.
- Copy JSON to clipboard with a single click.
- Responsive UI for both desktop and mobile.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Firebase** (config storage) / **Redis** (auth storage)
- **CSS / SCSS** for custom styling

##

<img width="3844" height="302" alt="Security   data" src="https://github.com/user-attachments/assets/f8ce7096-9d0a-4cd0-9ab5-e52b1e39204b" />

##

Void Presence uploads only **Rich Presence configuration data** when you use cloud features or share configs on the website.

What can be stored in the cloud:

- **Config data** – button pairs, status cycles, image cycles and related settings (`configData`, `buttonPairs`, `cycles`, `imageCycles`)
- **Metadata** – config title, description, upload timestamp, download counter (`title`, `description`, `uploadedAt`, `downloads`)
- **Author name** – your display name or handle shown as the config author (`author`, for example `Devollox`)

What is **not** stored:

- No Discord tokens, passwords or OAuth keys
- No personal messages or Discord account data
- No system files or arbitrary local data

Configs are used only to render Rich Presence and to let you share presets between machines or with other users through the Void Presence website.

##

<img width="3844" height="302" alt="Author" src="https://github.com/user-attachments/assets/40ce01ee-a7e0-439e-b376-ad1974fbb5bf" />

##

Made with ❤️ by [Devollox](https://github.com/Devollox)

<p align="left">
  <img width="128" height="128" alt="выфвфы" src="https://github.com/user-attachments/assets/32b65183-a39c-4871-bb37-5fbe01ecaade" />
</p>

> **Void Presence** – Control your Discord presence. Own your story.
