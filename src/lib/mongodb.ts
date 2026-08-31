import { MongoClient } from "mongodb";

function mongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("请设置 MONGODB_URI，例如 mongodb://127.0.0.1:27017/qrss");
  }
  return uri;
}

type GlobalMongo = {
  client?: MongoClient;
  connecting?: Promise<MongoClient>;
};

const globalForMongo = globalThis as typeof globalThis & {
  _qrssMongo?: GlobalMongo;
};

function getStore(): GlobalMongo {
  if (!globalForMongo._qrssMongo) {
    globalForMongo._qrssMongo = {};
  }
  return globalForMongo._qrssMongo;
}

export async function getMongoClient(): Promise<MongoClient> {
  const store = getStore();
  if (store.client) return store.client;
  if (store.connecting) return store.connecting;

  // Local Next.js process: reuse one client across hot reloads and requests.
  // Pool stays small (max 10) because this is a single-instance reader, not a
  // high-concurrency API. minPoolSize 0 avoids holding idle connections in
  // serverless or idle-dev scenarios.
  const client = new MongoClient(mongoUri(), {
    maxPoolSize: 10,
    // Long-running Next.js process: keep one socket so an idle tab
    // doesn't pay TCP + auth again on the next page load.
    minPoolSize: 1,
    maxIdleTimeMS: 60_000,
    serverSelectionTimeoutMS: 5_000,
  });

  store.connecting = client
    .connect()
    .then((connected) => {
      store.client = connected;
      store.connecting = undefined;
      return connected;
    })
    .catch((error) => {
      store.connecting = undefined;
      throw error;
    });

  return store.connecting;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db();
}
