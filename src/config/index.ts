import convict from "convict";

var config = convict({
    env: {
        doc: "The application environment",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    port: {
        doc: 'The port to bind',
        format: 'port',
        default: 4000,
        env: 'PORT',
        arg: 'port'
    },
    db: {
        name: {
            doc: 'Database name',
            format: String,
            env: 'DB_NAME'
        },
        user: {
            doc: 'Database user',
            format: String,
            env: 'DB_USER',
        },
        password: {
            doc: 'Database password',
            format: String,
            env: 'DB_PASSWORD'
        }
    },
    session: {
        secret: {
            doc: 'Session Secret for express-session',
            format: String,
            env: "SESSION_SECRET"
        }
    }
});

var env = config.get('env');
config.loadFile('./config/' + env + '.json');
config.validate({ allowed: 'strict' });
export default config;