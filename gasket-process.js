const gasket = require("gasket");
const string = require("get-stream");
const stderr = true;

process.on("message", async ({ pipeline }) => {
  const stream = gasket({ pipeline }, { stderr }).run("pipeline");
  const result = await string(stream);
  process.send(result);
});
