# Geocity Front

## Generic tools

In order to build the project you'll need *yarn* and *nodejs* installed

### yarn installation

Please refer to  https://classic.yarnpkg.com/en/docs/install
On windows, install chocolately when asked to

## Build Setup

```bash
# init submodules dependencies
git submodule update --init --recursive
```

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Deployment

1. Clone this repository
2. Run ```yarn generate```
3. Copy dist folder to your static file server
4. Make sure that the static server file is listed in the ALLOWED_CORS environment variable in the backend config https://github.com/yverdon/geocity/blob/master/env.demo#L30



