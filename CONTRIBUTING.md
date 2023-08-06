# Contributing

When contributing to this repository, please first discuss the change you wish to make via [issues](https://github.com/loicpennequin/idle-game/issues).

## Git Commit, Branch, and PR Naming Conventions

When you are working with git, please be sure to follow the conventions below on your pull requests:

```text
PR: [#ISSUE ID] Title of the PR
```

## Prerequisites

You will need to [install docker](https://www.docker.com/get-started/) on your local machine.

If you do not have docker, go here to download and install: <https://www.docker.com/get-started/>

If you are getting WSL error when you launch your desktop docker application, go here and follow these steps for windows: <https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package>.

You will also need to use Yarn as a package manager.

## Installation

There are two ways to get started with the project locally

### Automatic setup

1. Fork the repo and clone your fork

   ```sh
    git clone https://github.com/loicpennequin/idle-game.git
   ```

2. Navigate to the project directory

   ```sh
   cd dungeon-crawler
   ```

3. Run the following command to install dependencies
   ```sh
   yarn install
   ```
4. Run the following command to setup the project. Note: You will need the have Docker running to execute this step.
   ```sh
   yarn cli:run setup
   ```

### Manual setup

1. Fork the repo and clone your fork

   ```sh
    git clone https://github.com/loicpennequin/idle-game.git
   ```

2. Navigate to the project directory

   ```sh
   cd idle-game
   ```

3. Run the following command to install dependencies
   ```sh
   yarn install
   ```
4. Run the following command to setup the project. Note: You will need the have Docker running to execute this step.
   ```sh
   yarn cli:run setup
   ```
5. create a `.env` file at `apps/server` and copy-paste the content of `apps/server/.env.example` into it
6. create a `.env` file at `apps/client` and copy-paste the content of `apps/client/.env.example` into it
7. If you are using docker, run the following command
   ```sh
   yarn db:start
   ```
   If you are not using Docker, make sure your database is available. You will need to update the `DATABASE_URL` environment variable in the `apps/server/.env` file.
8. Generate a version of Prisma Client that is tailored to the models.

   ```js
   yarn db:sync
   ```

### Starting the project

1. run the following command

```sh
yarn dev
```

2. Open your browser and visit <http://localhost:3000> to see the application running.
3. Visit <http://localhost:5000/api-docs> to see the generated back end API documentation
4. Visit <http://localhost:1080> to see the mail server and inspect all the sent e-mails.

## Working on New Features

If you're new to github and working with open source repositories, Watch this video by Web Dev Cody which will walks you through the process:
[![How to make a pull request on an open source project](https://img.youtube.com/vi/8A4TsoXJOs8/0.jpg)](https://youtu.be/8A4TsoXJOs8)

If you want to work on a new feature, follow these steps.

1. Fork the repo
2. Clone your fork
3. Checkout a new branch
4. If yo uare working on a completely new feature, you can run the following command to generate all the boilerplate files for the server / client / shared packages

```sh
yarn cli:run feature [name]
```

5. Do your work
6. Commit
7. Push your branch to your fork
8. Go into github UI and create a PR from your fork & branch, and merge it into upstream MAIN

## Pulling in changes from upstream

You should regularly pull in the changes that are added as it is actively developed, preferably before you checkout a new branch to do new work.

1. git checkout main
2. git pull upstream main

## Code of Conduct

Who cares just don't be dumb and / or an asshole
