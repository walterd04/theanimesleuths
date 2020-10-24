import "reflect-metadata";
import express from "express";
import compression from "compression";
import session from "express-session";
import cors from "cors";
import errorHandler from "errorhandler";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

class App {
    private appSession: express.Application;

    constructor() {
        this.appSession = express();
        this.configureMiddlewares();
    }

    private configureMiddlewares() {
        this.appSession.use(compression());
        this.appSession.use(express.json());
        this.appSession.use(express.urlencoded({ extended: true }));
        this.appSession.use(cors());
        this.appSession.use(errorHandler);
    }

    public listen() {
        this.appSession.listen(4000, () => console.log("Listening on port 4000"));
    }
}

export default App;