# Therapy Sessions

## Installation

This app requires Node.js. Once Node is installed, run `npm install`
to install Node dependencies, and then run `npm run migrate` to
prepare the database.

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

Then you can run the tests with `npm run e2e`.
