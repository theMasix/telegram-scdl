# telegram-scdl

A Telegram SoundCloud Downloader Bot using NodeJS.

It's built on top of the [Telegraf](http://github.com/telegraf/telegraf) and [MongoDB](https://github.com/mongodb/mongo).

Use it on Telegram at [SoundCloud Downloader Bot](http://t.me/scdl_bot)

## Install and Development

to run bot, first config your `.src/config.js` and `.env` file. Then you can run `npm start`

## Deployment

I deployed the app on [Fandogh Cloud](https://fandogh.cloud/) PaaS. You can do it too!

### Fandogh First Deployment

---

- Step 1 (Create project on Fandogh):

  `fandogh image init --name <your-project-name>`

- Step 2 (send Dockerfile to Fandogh and build the image):

  `fandogh image publish --version <your-app-version>`

- Step 3:
  create `fandogh.yaml` and put your deploy conventions

  You can see [Fandogh Manifest Doc](http://github.com)

- Step 4 (deploy the app):

  `fandogh service apply -f fandogh.yaml`

### Fandogh update app and redeploy

---

- Step 1:
  Update your package.json to new app version
- Step 2 (send Dockerfile to fandogh creates new image):

  `fandogh image publish --version <your-app-new-version>`

- Step 3:
  Update your `fandogh.yaml` to use new image version
- Step 4 (redeploy app with new image):

  `fandogh service apply -f fandogh.yaml`

### License

---

Code released under the [MIT License](http://github.com/themasix/telegram-scdl/blob/master/LICENSE).
