require("./check-environment");

const { parse: qsParser } = require("qs");
const { parse: urlParser } = require("url");
const { send } = require("micro");
const { OK, BAD_REQUEST, MOVED_TEMPORARILY } = require("http-status-codes");
const gears = require("./gears");
const { createReadStream } = require("fs");

const redirectTo = (res, Location) => {
  res.writeHead(MOVED_TEMPORARILY, { Location });
  res.end();
};

const renderHome = res => {
  createReadStream("./index.html").pipe(res);
};

const run = async (res, query) => {
  const { p: pipeline = [], redirect } = qsParser(query);
  try {
    const result = await gears({ pipeline });
    if (Boolean(redirect) === true) redirectTo(res, result.trim());
    else send(res, OK, result);
  } catch (error) {
    send(res, BAD_REQUEST, error.message || error);
  }
};

module.exports = (req, res) => {
  const { pathname, query } = urlParser(req.url);
  if (pathname === "/run") run(res, query);
  else renderHome(res);
};
