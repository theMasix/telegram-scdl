# telegram-scdl

A Telegram Sound Cloud Bot using NodeJS

## Install

to run bot, first config your `.src/config.js` and generate you key and cert then run `node run ./src/server.js`

## Deployment

I deployed the app on Fandogh PaaS. You can do it too!

### Fandogh First Deployment

---

- Step 1 (Create project on fandogh):

  `fandogh image init --name <your-project-name>`

- Step 2 (send Dockerfile to fandogh and build the image):

  `fandogh image publish --version <your-app-version>`

- Step 3:
  create `fandogh.yaml` and put your deploy conventions
- Step 4 (deploy the app):

  `fandogh service apply -f fandogh.yaml`

### Fandogh update app and redeploy

---

- Step 1:
  Update your package.json to new app version
- Step 2 (send Dockerfile to fandogh create new image):

  `fandogh image publish --version <your-app-new-version>`

- Step 3:
  Update your `fandogh.yaml` to use new image version
- Step 4 (redeploy app with new image):

  `fandogh service apply -f fandogh.yaml`
