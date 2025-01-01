# Therapy Sessions

This application allows therapists and clients to register and sign-in
to view, create, and book sessions with each other.

## Assumptions Made

- Users consist only of a unique username and a password hash
- Users can book any open session (one that has been created but does
  not have a client assigned yet)
- Sessions must have a therapist

## Installation

The app requires Node.js. Once Node is installed, run `npm install` to
install Node dependencies, and then run `npm run migrate` to prepare
the database. You will then need to copy `server/.env.example` to
`server/.env` and you may change its configuration.

## Running the App in Dev Mode

To run the app in dev mode with recompilation on change, do `npm
run dev`.

## Running Tests

You can run the unit tests with `npm t`.

To run the e2e tests, you'll need a recent version of Python. You can
install the dependencies with:

```sh
pip install -r requirements.txt
playwright install --with-deps
```

Then you can run the tests with `npm run e2e`. Note that you'll need
the app up and running, and that this will clear out the database. The
e2e specs sometimes fail the first time they're run, unfortunately,
but they generally pass the second.
