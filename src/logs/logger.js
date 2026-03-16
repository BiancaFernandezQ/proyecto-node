import pino, { transport } from "pino";

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss"
        },
    },
});

export default logger;