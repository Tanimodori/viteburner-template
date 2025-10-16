# Viteburner-template

This is a template for a viteburner project. It is a simple example of how to use Viteburner.

## How to use

Prerequisites: [Node.js](https://nodejs.org/en/download/)

```bash
git clone https://github.com/Tanimodori/viteburner-template.git
cd viteburner-template
npm i
npm run dev
```

In Bitburner, select `⚙ Options` on the bottom-left, go to "Remote API", enter the port that viteburner displays (default: `31337`), and click "Connect".

If you run into issues, make sure that the "API server" is enabled in the menu at the top. Also try picking a different port number and using that in both Bitburner and the `port` property in `vite.config.ts`

## API

See [viteburner](https://github.com/Tanimodori/viteburner/blob/main/README.md).

## How to update my clone to the latest version of the template

Usually you only need to upgrade viteburner using npm (or any other package manager you use).

```bash
npm i -D viteburner@latest
```

Or if you want to update all configs:

```bash
# add "upstream" to git remote in case you've overwritten the "origin"
git remote add upstream https://github.com/Tanimodori/viteburner-template.git
# fetch the updates from "upstream"
git fetch upstream
# perform the merge
git merge upstream/main
# NOTE: resolve git conflicts manually now.
# install packages if any gets updated.
npm i
```

## License

[MIT License](LICENSE) © 2022-present Tanimodori
