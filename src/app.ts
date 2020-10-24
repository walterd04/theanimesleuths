import "reflect-metadata";
import express from "express";
import compression from "compression";
import session from "express-session";
import cors from "cors";
import errorHandler from "errorhandler";
import mongo from "connect-mongo";
import mongoose from "mongoose";
import bluebird from "bluebird";
import dotenv from "dotenv";
dotenv.config();

interface DbConnection {
  name: string;
  password: string;
  user: string;
}

class App {
  private appSession: express.Application;
  private port: number;
  private sessionSecret: string;
  private dbConnectionInfo: DbConnection;
  private mongoUri: string;
  private MongoStore: mongo.MongoStoreFactory;

  constructor() {
    this.appSession = express();
    this.port = (process.env.PORT as unknown) as number;
    this.dbConnectionInfo = {
      name: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
    };
    this.buildDbUri();
    this.connectToDatabase();
    this.MongoStore = mongo(session);
    this.configureMiddlewares();
  }

  private configureMiddlewares() {
    this.appSession.use(compression());
    this.appSession.use(express.json());
    this.appSession.use(express.urlencoded({ extended: true }));
    this.appSession.use(cors());
    this.appSession.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: this.sessionSecret,
        store: new this.MongoStore({
          url: this.mongoUri,
          autoReconnect: true,
        }),
      }),
    );
    this.appSession.use(errorHandler);
  }

  private buildDbUri(): void {
    const { name, user, password } = this.dbConnectionInfo;
    this.mongoUri = `mongodb+srv://${user}:${password}@cluster0-xcrfk.mongodb.net/${name}?retryWrites=true&w=majority`;
  }

  private async connectToDatabase(): Promise<void> {
    try {
      mongoose.Promise = bluebird;
      await mongoose.connect(this.mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });

      console.log("MongoDB Connected and ready to use");
    } catch (error) {
      console.error(error);
    }
  }

  public listen(): void {
    this.appSession.listen(this.port, () =>
      console.log(`Listening on port ${this.port}`),
    );
  }
}

export default App;
