// Allow parsing of .json5 files (with comments and all the good stuff)
require("json5/lib/register");

const config = require("./config.json5");

// It is possible to avoid using DEBUG=pad:* in launch args
// to display debug messages, see official doc for details.
let debug = require("debug")("pad:main");
debug.log = console.log.bind(console);

const server = require("http").createServer();
const io = require("socket.io")(server, {
  path: "/api"
});

let pads = {};

function getPadInfo(slug) {
  let isNewPad = false;

  // Create pad if it does not exist yet
  if (!pads.hasOwnProperty(slug)) {
    pads[slug] = {
      type: "text",
      language: "javascript",
      isUnloaded: false,
      lastAccess: Date.now(),
      data: ""
    };
    debug(`New pad created: /${slug}`);

    // Tell everyone else that the pad count has been updated
    io.of("padCount").emit("padCountUpdate", Object.keys(pads).length);

    isNewPad = true;
  }

  return {
    isNewPad: isNewPad,
    isPasswordProtected: pads[slug].type === "password",
    pad: pads[slug]
  };
}

async function getPadData(slug) {
  if (pads[slug].isUnloaded) {
    pads[slug].data = await dbManager.getPadData(slug);
    pads[slug].isUnloaded = false;
  }

  pads[slug].lastAccess = Date.now();
  return pads[slug].data || "";
}

// The DB Manager smartly clears the memory and saves the data
// to the DB at regular intervals
const DBManager = require("./DBManager.js");
let dbManager = new DBManager(pads);

const port = 8888;

server.listen(port, () => debug(`Server listening on port ${port}!`));

// A namespace called "info", independent from the
// original default "/" namespace
io.of("padCount").on("connection", socket => {
  socket.emit("padCountUpdate", Object.keys(pads).length);
});

io.of("padList").on("connection", socket => {
  let padList = [];
  for (let slug in pads) {
    let pad = pads[slug];
    padList.push({
      slug: `/${slug}`,
      isPasswordProtected: pad.type === "password"
    });
  }

  socket.emit("padList", padList);
});

let padsNamespace = io.of("pads");
padsNamespace.use((socket, next) => {
  let slug = socket.handshake.query.slug;
  if (slug && slug.indexOf("/") == -1) {
    return next();
  }
  return next(new Error("Wrong slug id!"));
});

// Default "/" namespace
padsNamespace.on("connection", async socket => {
  let slug = socket.handshake.query.slug;
  ({ isNewPad, isPasswordProtected, pad } = getPadInfo(slug));

  let init;
  if (isPasswordProtected) {
    init = { isPasswordProtected: true };
  } else {
    init = {
      enableAdminTools: isNewPad,
      isPasswordProtected: false,
      language: pad.language,
      data: await getPadData(slug)
    };
    joinRoom();
  }
  // Always send an init socket with the pad data if not password protected
  socket.emit("init", init);

  if (isNewPad) allowPasswordSetOperations();

  socket.on("password", async password => {
    let isAdminPassword = password === config.adminPassword;
    let response = {
      // Allow access if password is correct or is admin password
      isPasswordCorrect: pad.password === password || isAdminPassword
    };
    if (response.isPasswordCorrect) {
      response = {
        ...response,
        language: pad.language,
        data: await getPadData(slug)
      };
      if (isAdminPassword) {
        response = { ...response, enableAdminTools: true };
        allowPasswordSetOperations();
      }
      joinRoom();
    }
    socket.emit("password", response);
  });

  function joinRoom() {
    socket.join(slug);

    socket.on("update", (delta, fullText) => {
      // Send the delta to all other people using the same pad
      socket.to(slug).emit("update", delta);
      pad.data = fullText;
      pad.lastAccess = Date.now();
    });

    socket.on("setLanguage", newLanguage => {
      // TODO: check if language is correct here.
      pad.language = newLanguage;
      socket.to(slug).emit("setLanguage", newLanguage);
    });
  }

  function allowPasswordSetOperations() {
    socket.on("setPassword", password => {
      if (!password.trim()) return;

      pad.type = "password";
      pad.password = password;
      // Confirm that the password has been set successfully
      socket.emit("setPasswordConfirmation");
    });
  }
});
