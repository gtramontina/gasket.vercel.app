const { dir } = require("tmp-promise");
const { copy, chown } = require("fs-extra");
const { join } = require("path");
const { fork } = require("child_process");
const pTimeout = require("p-timeout");

// TODO: improve – http://www.linfo.org/uid.html
const randomUID = () => parseInt(Math.random() * (65534 - 10000) + 10000);

const NODE_PATH = join(process.cwd(), "node_modules");
const env = { ...process.env, NODE_PATH };
const silent = true;

module.exports = async ({ pipeline, timeout = 5000 }) => {
  let errors = "";
  const uid = randomUID();
  const guid = uid;
  const { path: cwd, cleanup } = await dir({ unsafeCleanup: true });
  await copy("gasket-process.js", join(cwd, "process.js"));
  await chown(cwd, uid, guid);

  const child = fork("process", { silent, cwd, uid, guid, env });
  return pTimeout(
    new Promise((resolve, reject) => {
      child.once("message", result => {
        child.once("close", () => {
          if (errors) reject(errors);
          else resolve(result);
        });
        child.kill();
      });
      child.stderr.on("data", data => (errors += data.toString()));
      child.send({ pipeline });
    }),
    timeout,
    `Execution timed out after ${timeout}ms.`
  ).finally(() => {
    cleanup();
    child.removeAllListeners();
    child.stderr.removeAllListeners();
    child.kill();
  });
};
