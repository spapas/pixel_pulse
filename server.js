"use strict";

// Tiny static server: serves index.html + tests locally.
// No deps. Run: npm start, then open http://localhost:8901/?dev=1

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = +(process.env.PORT || 8901);
const ROOT = __dirname;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

function serve(req, res) {
  const urlPath = (req.url || "/").split("?")[0].split("#")[0];
  const rel = urlPath === "/" ? "index.html" : urlPath.slice(1);
  const file = path.join(ROOT, rel);

  if (!file.startsWith(ROOT)) {
    send(res, 403, "forbidden");
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      send(res, 404, "not found");
      return;
    }

    send(res, 200, data, TYPES[path.extname(file)] || "application/octet-stream");
  });
}

http.createServer(serve).listen(PORT, () => {
  console.log("Pixel Pulse on http://localhost:" + PORT + "/?dev=1");
});
