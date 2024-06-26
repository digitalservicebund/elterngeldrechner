# ed-egr-app

This App is implemented from a custom [Create React App](https://create-react-app.dev/) (CRA) template to build a **Multistep Form Wizard** configurable by an external JSON file. The App has to be extended by further components - currently the input types text, radio and checkbox are implemented. An select element is also inclueded. (as of March 29th, 2022). The App must meet the current BITV requirements.

- [1. What's included](#1-whats-included)
- [2. Things to know](#2-things-to-know)
  - [2.1. Enforce certain node and npm version](#21-enforce-certain-node-and-npm-version)
  - [2.2. Use project specific css namespace prefix](#22-use-project-specific-css-namespace-prefix)
  - [2.3. Available Scripts](#23-available-scripts)
    - [2.3.1. `npm start`](#231-npm-start)
    - [2.3.2. `npm test`](#232-npm-test)
    - [2.3.3. `npm run build`](#233-npm-run-build)
    - [2.3.4. Other scripts](#234-other-scripts)
- [3. JSON Configuration File - Example](#3-json-configuration-file-example)

## 1. What's included

The following things are included:

- TypeScript support (see also [Getting Started with TypeScript and React](https://create-react-app.dev/docs/adding-typescript/#getting-started-with-typescript-and-react))
- SCSS support (see also [Adding a Sass Stylesheet](https://create-react-app.dev/docs/adding-a-sass-stylesheet/))
- [\]init\['s eslint rules](https://wim.init.de/display/TC/Frontend+Linter+und+Richtlinien#FrontendLinterundRichtlinien-Javascript)
- [\]init\['s stylelint rules](<https://wim.init.de/display/TC/Frontend+Linter+und+Richtlinien#FrontendLinterundRichtlinien-(s)CSS>)
- The recommended ]init[ frontend [editorconfig](https://wim.init.de/display/TC/Frontend+Linter+und+Richtlinien#FrontendLinterundRichtlinien-.editorconfig)
- [\]init\['s prettier rules](https://wim.init.de/display/TC/Frontend+Linter+und+Richtlinien#FrontendLinterundRichtlinien-Prettier) that work together with eslint, editorconfic and stylelint
- Separate package.json scripts for these tools
- [Git hook](https://create-react-app.dev/docs/setting-up-your-editor/#formatting-code-automatically) that formats changed code
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management (not to be confused with the low-level [redux](https://redux.js.org/) library)
  - Great opininated defaults for store setup and slices for state structure
  - Less boilerplate, more relevant code
  - "Automatic" immutable data structures out of the box
- Easily enforces certain node/npm versions and encourages to use the latest [LTS version](https://nodejs.org/en/about/releases/)
- Uses [\]init\['s Atomic Design](https://wim.init.de/display/FT/Setup+Project+-+Atomic+Design) structure (as far as it makes sense for React)
- Follows and enforces the [\]init\['s BEM guidelines](https://wim.init.de/pages/viewpage.action?pageId=64951753) using SCSS
- [React Hook Form](https://react-hook-form.com/) for form handling and form validation. **It is important to implement uncontrolled React Form Components as far as possible to keep the Apps simplicity**. Redux stores the form values step by step on form submit in its store. These values will populate the components _Default Values_ (see [Uncontrolled Components](https://reactjs.org/docs/uncontrolled-components.html) and [useForm API from React Hook Form](https://react-hook-form.com/api/useform)).
- [React Router](https://reactrouter.com/docs/en/v6) for the individual form steps wich will be lazy loaded. Because the App should not take over the browser navigation, the router is implemented as a [Memory Router](https://reactrouter.com/docs/en/v6/api#memoryrouter).

## 2. Things to know

### 2.1. Enforce certain node and npm version

This has to be done in the `package.json` by using these lines:

```json
  "engines": {
    "node": ">=16.7.0",
    "npm": ">=7.20.0"
  },
```

### 2.2. Use project specific css namespace prefix

Edit the files `src/projectNamespace.js` and `src/utils/scss/_settings.scss` to set a project specific css prefix. This avoids css name clashes with possible third-party/external css files.

### 2.3. Available Scripts

In the project directory, you can run:

#### 2.3.1. `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### 2.3.2. `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### 2.3.3. `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### 2.3.4. Other scripts

There are further small scripts for formatting, linting or testing. Please see the `scripts` section in the `package.json` for details.

## 3. App-Parameter

### 3.1. ElterngeldDigital Wizard URL

EG data will be sent to the configurable url. The url must be set on the root div:

```
<div id="egr-root" data-eltern-geld-digital-wizard-url="https://egeld-digital.dev.init/wizardFrontServlet?_m=Elterngeld"></div>
```

Current urls are:

- DEV: `https://egeld-digital.dev.init/wizardFrontServlet?_m=Elterngeld`
- STAGE: `https://www-eao.init-ag.de/wizardFrontServlet?_m=Elterngeld`
- PROD: `https://www.elterngeld-digital.de/wizardFrontServlet?_m=Elterngeld`
