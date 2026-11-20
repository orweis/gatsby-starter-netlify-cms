# Contributing

Contributions are always welcome, no matter how large or small. Before
contributing, please read the [code of conduct](CODE_OF_CONDUCT.md).

## Setup

You need Node.js 22 or newer (`nvm use` reads `.nvmrc`) and npm.

```sh
git clone <repository-url>
cd gatsby-starter-netlify-cms
npm install
npm run develop
```

See the [README](README.md#scripts) for all available scripts, including
`npm run cms` to edit content locally through the CMS.

## Before opening a pull request

1. Create a branch from the default branch. If you are addressing an issue,
   prefix the branch name with the issue number.
2. Add or update tests for code you change (`test/`). Tests must not live under
   `src/pages/`, because Gatsby turns every file there into a page.
3. Update the documentation (README, CHANGELOG) if you change behavior.
4. Run the same checks CI runs:

   ```sh
   npm run check   # lint + format check + tests
   npm run build   # production build
   ```

   `npm run format` fixes formatting.

5. Describe breaking changes and a migration path in the pull request and under
   "Unreleased" in [CHANGELOG.md](CHANGELOG.md).

## Dependencies

Dependabot opens weekly update pull requests. Review them like any other
change; nothing is merged automatically. Keep exactly one lockfile
(`package-lock.json`).

## Reporting security issues

Do not open a public issue; see [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the
project's [MIT license](LICENSE).
