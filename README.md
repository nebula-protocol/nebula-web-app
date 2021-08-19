# Run development server

## Install node.js and yarn (macOS)

```sh
brew install node
npm install -g yarn
```

## Install iTerm2 (macOS)

<https://iterm2.com/>

If you run dev server without iTerm2, you can see 3 macOS default terminals.

## Set the local Root CA (macOS)

<https://github.com/FiloSottile/mkcert>

```sh
brew install mkcert
mkcert -install
mkcert example.com "*.example.com" example.test localhost 127.0.0.1 ::1
```

This step makes 2 `*.pem` files on your terminal location

Set the file locations to system env (e.g. `.zshrc`)

```sh
export LOCALHOST_HTTPS_CERT="/Your/location/localhost+1.pem"
export LOCALHOST_HTTPS_KEY="/Your/location/localhost+1-key.pem"
```

They will use in `~/app/vite.config.ts` file (for `https://`)

## Get repository

```sh
git clone https://github.com/nebula-protocol/nebula-web-app.git
cd nebula-web-app
yarn install
cd app
yarn run start
```

After that, it will open iTerm2 terminal and a chromium browser window.

<img src="readme-assets/img.png" width="900" />

<img src="readme-assets/img_1.png" width="900" />
