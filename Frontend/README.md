# Galaxia

## Features

## Dependencies

To get started with development, you will need a browser that runs JavaScript and some extra prerequisites:

- [Node.js (17)](https://nodejs.org) - _Runtime Environment_
- [Yarn](https://yarnpkg.com/getting-started/install) - _Package manager_
- A (relatively recent) browser that allows JavaScript.

## Build Setup

All commands are run from the root of the project, from a terminal:

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `yarn install`     | Installs dependencies                        |
| `yarn dev`     | Starts local dev server at `localhost:8000`  |
| `yarn build`   | Build production site to `./dist/`      |
| `yarn preview` | Preview build locally, before deploying |

## Testing

All test commands are run from the root of the project, from a terminal:

| Command                     | Action                                                                  |
| :-------------------------- | :---------------------------------------------------------------------- |
| `pnpm install`              | Installs dependencies                                                   |
| `yarn test`             | Run all tests in [`./tests/`](tests)                                    |
| `yarn test:unit`        | Run all units tests in [`./tests/unit`](tests/unit)                     |
| `yarn test:integration` | Run all integration tests in [`./tests/integration`](tests/integration) |
| `yarn test:e2e`         | Run all e2e tests in [`./tests/e2e`](tests/e2e)                         |

Note that, by default, a coverage report is always generated when running tests.

## Deployment

Deploys to Firebase occur on every push, provided all tests pass.

Manual deployment to the hosting platform can be performed using:

```bash
yarn deploy
```

The production app is then available at:

[`https://galaxia-js.web.app`](https://galaxia-js.web.app)

## Roadmap

## Acknowledgements

Nothing to see here yet!

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
