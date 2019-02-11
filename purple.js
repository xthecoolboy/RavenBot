const PurpleClient = require('./purple/client/purple_client'); require('dotenv').config();
const token = process.env.TOKEN;

const client = new PurpleClient();

client.on('error', err => client.logger.error(`[CLIENT ERROR] ${err.message}`, err.stack));
client.on('warn', warn => client.logger.warn(`[CLIENT WARN] ${warn}`));

client.start(token); client.metrics();