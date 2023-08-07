# Dungeon Crawler

This is the repository for a multiplayer dungeon crawler type game running in the browser. The project is built using [Vue.js](https://vuejs.org/), [PixiJS](https://pixijs.com/), [Express](https://expressjs.com/), [Ts-rest](https://ts-rest.com/) and [Socket.IO](https://socket.io/)

## Project setup

See the [contributing guide](./CONTRIBUTING.md)

## Contribution

See the [contributing guide](./CONTRIBUTING.md)

## Project Stucture

the project is a monorepo using the [Turborepo](https://turbo.build/). It is divided in multiple packages with relationship between each other to promote code reuse and decoupling. Here is a summary of the different packages

- `apps/server` is the REST API that provides the data from the project database, as well as the websockets. In production, it also serves the front end client.
- `apps/client` is the front end Vue application that allows you to login and play the game
- `configs/eslint-config` is the [ESLint](https://eslint.org/) config shared by all packages
- `libs/game-engine` is the library containing the code to run the logic that orchestrates the game's state such as player position, handling player input, AI behavior, and so on. It is designed to be able to run in a node environment or the browser to allow for offline play.
- `libs/game-client` is the code containing the rendering logic of the game, such as sprites positios, animations, visual effects. It also emits events that can be forwarded to the game engine, like player keyboard input. the library uses [Vue3-pixi](https://vue3-pixi.vercel.app/) to allow an easy integration between Pixi and vueJS.
- `libs/contract` contains the contract definition for the operations related to the web app. Both the serva dn the client implements and / or consume the contract to enable a lot of code sharing, such as types and validators, as well as easier type safety across the wire.
- `libs/resources` contains all of the game assets such as tile maps, sprites, sounds effects...it also contains description and stats for all game objects (items, characters, monsters, skills...). It can be consumed by any other package in a node environment or the browser
- `lib/shared` contains utilities like helpers and mapped types

### Local development

1. Follow the steps in the [contributing guide](./CONTRIBUTING.md) to setup the project

2. run the following command

```sh
yarn dev
```

3. Open your browser and visit <http://localhost:3000> to see the front end webapp running.
4. Open your browser and visit <http://localhost:3001> to see a standalone of the game client running.
5. Visit <http://localhost:5000/api-docs> to see the generated back end API documentation
6. Visit <http://localhost:1080> to see the mail server and inspect all sent e-mails.

### Running a production build locally

1. run the following command

```sh
yarn build
```

2. start the server with

```sh
yarn start
```

The server will run on port 5000
