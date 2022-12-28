# ccd-portal

Revamped ReactJS Web App for CCD (Client Care Deptt) customer portal.

## NPM Scripts

You can run following comands:

- `yarn start`: For daily local development
- `yarn debug`: Similar as `yarn start`, a little slower then `yarn start` but has more accurate sourcemap and compatible styles
- `yarn build`: For production build
- `yarn analyze`: Run build analyzer
- `yarn format`: Format all your code
- `yarn lint`: Run code style checker

## Configure local proxy

You can edit `/dev-proxy.js` to apply proxy for your local devlopment enviroment.

## Upgrade dependencies

Use `yarn upgrade-interactive` to upgrade dependencies. _**Nerver**_ edit `package.json` manually.

## Run in Docker for devlopment

Run `docker-compose -f docker-compose-local.yml up`.

