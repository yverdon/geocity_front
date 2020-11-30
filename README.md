# Geocity Front

## Generic tools

In order to build the project you'll need _yarn_ and _nodejs_ installed

### yarn installation

Please refer to https://classic.yarnpkg.com/en/docs/install
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

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Release

The `CHANGELOG.md` file is automatically update at the root of the project based on the commit messages as long as they follow the [Angular commit guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines). It will also bump the version number in the `package.json`, run the generate command above, commit, tag and push the changes. This process is interactive and you’ll be able to skip steps manually if you like.

To release a new version run:

```bash
yarn release [patch|minor|major|version_number]
```

By default the version bump is automatically determined based on the commits messages.

Read more in the [release-it documentation](https://github.com/webpro/release-it).

## Deploy

To deploy a build of the project, simply replace the blank command in the `package.json`, under `scripts -> deploy`. This will be automatically invoked at the end of the release process described above.

An example of a simple deploy command using `rsync`:

```json
"deploy": "rsync -avz --delete --exclude='.*' dist/ user@server.com:/var/www/html/my-project"
```

You can also deploy manually at any time by running:

```bash
yarn deploy
```

⚠️ Notice the `--delete` flag which means all files not present locally will be deleted on the remote server. Be careful, this can leads to data loss!

⚠️ If your want to deploy not on the root you need to add the pathname accordingly inside the `package.json` under `pathname` default is set to `/`.

⚠️ Make sure that the static server file is listed in the ALLOWED_CORS environment variable in the backend config https://github.com/yverdon/geocity/blob/master/env.demo#L30
