# Vocapp

## How to run locally

1. Clone this repository using a command in terminal: `git clone https://github.com/krystianlisowski/vocapp.git`
2. Navigate to the project `cd vocapp`
3. Install npm pacakges using `npm install`
4. Run `npm run start` for a dev server with a Firebase emulators for Authentication and Database.
5. Navigate to `http://localhost:4200/`.

If you are running this application locally, Firebase emulators runs with empty database - in that case you need to create an account via `/register` page.
At this point your email is not verified (create, edit and delete actions are not available) - verification link should be available in your console - click on it.
Now, after application reload you can add new vocabulary, edit or delete exsisting vocabulary (only if you are an author).

## Running unit tests

Run `npm run test` to execute the unit tests via [Jest](https://jestjs.io/).
