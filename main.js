/* globals module */

const config = require("./config");

const app = require("./config/app");

const data = require("./data")(config);

const controllers = require("./controllers")(data);

require("./routers")(app, controllers);

app.listen(config.port, () => console.log(`Running at :${config.port}`));