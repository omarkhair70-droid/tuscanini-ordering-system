import {createPool} from './db.js';
import {createOrderApi,serviceSettingsFromEnvironment} from './server.js';

const settings=serviceSettingsFromEnvironment();
const pool=createPool();
await pool.query('SELECT 1');
const port=Number(process.env.PORT??8080);
if(!Number.isSafeInteger(port)||port<1024||port>65535)throw Error('Invalid PORT');
const server=createOrderApi(pool,settings);
server.listen(port,'0.0.0.0',()=>console.log('Tuscanini order API ready on port '+port));
async function shutdown(){
  server.close(()=>{void pool.end();});
}
process.once('SIGINT',()=>{void shutdown()});
process.once('SIGTERM',()=>{void shutdown()});
