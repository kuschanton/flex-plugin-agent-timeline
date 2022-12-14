# Screenshots

![Agents Timeline View 1](screenshots/screenshot_1.png)

# Plugin

This Twilio Flex Plugin enables your supervisors to see agents activity timeline, filter by selecting agents and choose time range to be displayed.

To learn more about developing plugins on your Flex instance, refer to the [getting started guide](https://www.twilio.com/docs/flex/quickstart/getting-started-plugin).

## How it works

This Plugin uses following Twilio Products. It is easy to have it running quickly!

- It uses [Twilio Functions](https://www.twilio.com/docs/runtime/functions) to get list of workers and list of events from Twilio API;
- It uses the new [Twilio Paste](https://paste.twilio.design) - which is the base for all future Flex Plugins;

## Oh, before installing it:

You need to enable [Flex UI 2.0](https://www.twilio.com/changelog/flex-ui-20-is-now-in-public-beta), the newest version of Flex!

## How to install

We have to install 2 assets:

- The Twilio Functions (back-end)
- The Flex Plugin (front-end)

#### To install the Twilio Functions:

1. clone this repo;
2. execute `cd ./functions` to go to the Twilio Functions folder.
3. `npm install` to install the packages into your computer.
4. rename `.env-example` from this folder to `.env` and follow the instructions in the `.env` file.
5. `npm run deploy` to deploy the functions to your Twilio environment.
6. Note the functions' domain in the output, you will need it to configure Plugin env. 

#### To install the Flex Plugin:

1. execute `cd ..` to go to the Plugin folder root.
2. `npm install` to install the packages into your computer.
3. rename `.env-example` from this folder to `.env` and follow the instructions in the `.env` file.
4. You need to have the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart). Type `twilio` in your terminal to see if you have it, if not, install it now.
5. You need the [Flex Plugins CLI](https://www.twilio.com/docs/flex/developer/plugins/cli/install) . Type `twilio plugins` to make sure you have it, if not, install it.
6. You need to create a new profile for your Twilio CLI, type `twilio profiles:list` to check if you are using it correctly. If not, add a new profile with the cmd `twilio profiles:add`.
7. `npm run deploy -- --changelog "first deployment!"` to deploy this Plugin.
8. Once **step 7** is finished, it will show the next steps, you will have to run the command mentioned there (something like `twilio flex:plugins:release ... etc etc`)
9. We are done! Go to https://flex.twilio.com - You should see a new icon on the left-hand side. From there you can see Agents Timeline.

## Contributions ???
Contributions of all kinds are welcome!

## Used libraries
`react-google-charts` - https://developers.google.com/chart/interactive/docs/gallery/timeline#overview

