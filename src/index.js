import app from './app.js';
import logger from './logs/logger.js';
import env from './config/env.js';
import { sequelize } from './database/database.js';

async function main() {
    //asyncrono es cuando el codigo se ejecuta de manera no secuencial, es decir, una linea de codigo se puede ejecutar antes de que la linea anterior haya terminado. Por ejemplo, si tenemos una funcion que tarda 5 segundos en ejecutarse, el codigo no se quedara bloqueado durante esos 5 segundos, y se podra ejecutar otras lineas de codigo mientras esa funcion esta ejecutandose. Esto es especialmente util cuando estamos trabajando con operaciones que pueden tardar mucho tiempo en completarse, como las operaciones de red o las operaciones de base de datos.
    //syncrono es cuando el codigo se ejecuta de manera secuencial, es decir, una linea de codigo se ejecuta despues de la otra, y no se puede ejecutar nada hasta que la linea anterior haya terminado. Por ejemplo, si tenemos una funcion que tarda 5 segundos en ejecutarse, el codigo se quedara bloqueado durante esos 5 segundos, y no se podra ejecutar nada mas hasta que esa funcion haya terminado.

    //inyectando sequelize, para que se conecte a la base de datos, asyncrono porque la conexion a la base de datos puede tardar un poco, y no queremos que el codigo se quede bloqueado mientras se conecta a la base de datos. Si la conexion a la base de datos falla, el codigo no se quedara bloqueado, y se podra manejar el error de manera adecuada.
    await sequelize.sync({ force: false });

    //1. traemos el app y escuchamos el puerto
    const port = env.port;
    app.listen(port);
    logger.info('Servidor corriendo en port ' + port);
}

main();
