import redis from 'redis';
import bluebild from 'bluebird';
bluebild.promisifyAll(redis);

var client=redis.createClient();
export default client;