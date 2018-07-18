const isDocker = require("is-docker");
const { red, yellow } = require("chalk");
const boxen = require("boxen");
const { FORCE } = process.env;

const message = `${yellow.bold(
  "WARNING:"
)} Given this service exposes your whole environment, it is not
recommended to run it outside of a sandbox. A Docker container is
provided with this repository, so please execute "make run" in order
to build and run this service in a docker sandbox. If you really want
to execute it locally, you can do so by setting the environment
variable "FORCE" to "true" and executing this command again. Like so:
"FORCE=true npm start"`;

if (!isDocker()) {
  console.warn(boxen(red(message), { padding: 1, margin: 1 }));
  Boolean(FORCE) || process.exit(1);
}
