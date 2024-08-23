# Firebase

## Prerequisites

- Internet connection (even for emulator)
- Setup a project in firebase
- Running and understanding the emulator
- Setting up the project to use firebase

## How to create a new Firebase application (Firebase Portal - Online)

### Steps

1. Login to [Firebase](https://firebase.google.com)

2. Navigate to the console

3. Create a new Application

    - Details:\
      Name: `tennessee-game-days`\
      Unique Project Id: `tennessee-game-days`

    - Note: Spark plan is $0 a month

4. Add Firebase to your web app

    1. Click on the </> to add a web app to your firebase app

    2. Fill out the nickname of your app.

    3. Click Register app

5. Install Firebase with npm (following instructions) in infrastructure folder

    ```bash
    npm install firebase
    ```

6. Setup a Database (choosing documentation is below)

    1. Add Database URL to configuration

## Setup required before running firebase application (locally)

- Ensure that you have firebase tools installed globally

   ```bash
   brew install firebase-cli
   ```

   ```bash
    firebase
   ```

1. Node.js version 8.0 or higher

2. Java version 1.8 or higher

    ```bash
    # If windows & chocolatey
    choco install oraclejdk
    ```

    ```bash
    # If mac & brew
    brew install --cask oracle-jdk
    ```

3. Install firebase-tools

    ```bash
    brew install firebase-cli
    ```

    ```bash
    # If no brew and NPM
    npm i -g firebase-tools
    ```

### Resources

- [Introduction to the Emulator](https://firebase.google.com/docs/emulator-suite)

- [Setting up the Emulator](https://firebase.google.com/docs/emulator-suite/connect_and_prototype)

- [Ports and more Information](https://firebase.google.com/docs/emulator-suite/install_and_configure)

### Login to firebase

Login to firebase so the tools know what they are communicating with

  ```bash
  firebase login
  ```

### Running the emulators

1. Initialize the emulators (you can skip this if you did it in the firebase init)

    ```bash
    firebase init emulators
    ```

2. Running the emulator

    ```bash
    firebase emulators:start
    ```

### If your emulator fails to start

Ensure that you have host set to `"host": "0.0.0.0",` inside of your
firebase.json file
