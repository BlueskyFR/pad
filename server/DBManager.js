// Allow parsing of .json5 files (with comments and all the good stuff)
require("json5/lib/register");

const config = require("./config.json5");

let debug = require("debug")("pad:DBManager");
debug.log = console.log.bind(console);
const MongoClient = require("mongodb").MongoClient;

// I chose here to use the prefix "_" to identify private members
module.exports = class DBManager {
  constructor(pads) {
    this.pads = pads;

    this._init();
  }

  async _init() {
    await this._initDBConnection();
    await this._initAutoBackup();
    await this._restorePads();
  }

  async _initDBConnection() {
    this.client = new MongoClient(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    try {
      // Use connect method to connect to the Server
      await this.client.connect();
    } catch (err) {
      debug(`Connection to the database failed! Error: ${err.stack}`);
    }

    // client.db(config.dbName) is our DB.
    // .collection(config.collectionName) is our collection INSIDE the DB.
    this.db = this.client.db(config.dbName).collection(config.collectionName);

    debug("Successfully connected to the database.");
  }

  _initAutoBackup() {
    // Convert minutes to ms
    setInterval(() => this.doBackup(), config.saveInterval * 60 * 1000);
    debug("Auto backup initialized!");
  }

  // Save everything to db and smartly free up memory
  async doBackup() {
    debug("Processing backup...");
    // Initialize bulk operation
    const bulk = this.db.initializeUnorderedBulkOp();
    let unloadedPadCount = 0;

    for (let slug in this.pads) {
      let pad = this.pads[slug];
      if (pad.isUnloaded) continue;

      bulk
        .find({ slug: slug })
        .upsert()
        .update({
          $set: {
            type: pad.type,
            language: pad.language,
            password: pad.password,
            data: pad.data
          }
        });

      // Unload decayed pads
      // Convert minutes to ms
      if (Date.now() - pad.lastAccess > config.unloadDelay * 60 * 1000) {
        pad.isUnloaded = true;
        pad.data = "";
        unloadedPadCount++;
      }
    }

    if (bulk.length > 0) {
      let res = await bulk.execute();
      debug(
        `Backup finished. Bulk result: ${res.nMatched} matched, ${res.nModified} modified and ${res.nUpserted} upserted.`
      );
    } else {
      debug("Backup finished. No modification made: already up to date.");
    }

    debug(`Unloaded ${unloadedPadCount} pad(s) from memory.`);
  }

  async _restorePads() {
    let savedPads = await this.db.find().toArray();
    for (let pad of savedPads) {
      this.pads[pad.slug] = {
        type: pad.type,
        password: pad.password,
        language: pad.language,
        isUnloaded: true,
        data: null
      };
    }

    debug(`${Object.keys(this.pads).length} pads restored from database!`);
  }

  async getPadData(slug) {
    let data = await this.db.findOne({ slug: slug });
    return data.data;
  }
};

// Pad structure specification for DB:
//
// {
//   slug: String,
//   type: String,
//   language: String,
//   data: String
// }
