# Geocity Front

## Generic tools

In order to build the project you'll need _yarn_ and _nodejs_ installed

### yarn installation

Please refer to https://classic.yarnpkg.com/en/docs/install
On windows, install chocolately when asked to

### Node version

If you have `nvm` installed on your system, you can simply `nvm use` in the root directory to pick up the correct version provided in the `.nvmrc` file.

## Build Setup & Developpment

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
$ yarn build
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Mock Service Worker

To enable MSW change the value of your env. variable `MSW` to 'enable'

## Configuration file

Additionnal configuration examples for deployment are availables under `/deploy_configurations`

```bash
# Create your env. file
$ cp .env.example .env
```

Additionnal configuration examples for deployment are availables under ```/deploy_configurations```

The `.env` file must contain:

🚨 Mandatory API URLs

The location API

```bash
LOCATION_API=https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=yverdon-les-bains&type=locations
```

The main GeoCity API

```bash
GEOCITY_API=https://form-preprod.mapnv.ch/rest/events/
```

🚀 For production

Needed if the application is not deployed on the root

```bash
PRODUCTION_PATH=/your-custom-path/
```

🔍 Filtering events from GeoCity API

:date: First event date

```bash
GEOCITY_API_EVENTS_START=2020-01-01
```

:date: Last event date

```bash
GEOCITY_API_EVENTS_END=2050-12-01
```

:date: Only display events that occure in the future

```bash
GEOCITY_API_SHOW_ONLY_FUTURE=true
```

:office: Community / City / Office for which events are displayed

```bash
GEOCITY_API_ADMINISTRATIVE_ENTITES=3
```

🔗 Link to the Django app login page

```bash
CTA_LINK=
```

:earth_africa: / :calendar: Choose the default view, value can be 'calendar' or 'map'
```bash
DEFAULT_VIEW='calendar'
```

:eyes: Show or hide the header and footer
```bash
DISPLAY_FOOTER_AND_HEADER=true
```

:calendar: Choose the default calendar visualisation mode.
Value can be : 'default', timeGridDay', 'timeGridWeek', 'dayGridMonth', 'listMonth'.
```bash
DEFAULT_CALENDAR_MODE='default'
```

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

🚨 Notice the `--delete` flag which means all files not present locally will be deleted on the remote server. Be careful, this can leads to data loss!

🚨 Make sure that the static server file is listed in the ALLOWED_CORS environment variable in the backend config https://github.com/yverdon/geocity/blob/main/env.demo#L45
