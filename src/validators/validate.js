function validate(schema, target = 'body') {
    return (req, res, next) => {
        const data = req[target]; //body, query, params, etc.

        //Paso 1: Verificar que exista datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                message: `El ${target} no puede estar vacio`
            });
        }

        //Paso 2: Validar contra el schema con opciones
        const { error, value } = schema.validate(data, {
            abortEarly: false, //no detenerse en el primer error, mostrar todos
            stripUnknown: true, // Eliminar campos no definidos en el schema
        });

        //Paso 3: Si hay errores de validacion, devolver 400 con mensaje claros
        if (error) {
            return res.status(400).json({
                message: 'Errores de validación',
                errors: error.details.map(err => err.message),
            });
        }

        //Paso 4: Reemplazar el objeto original con los datos validados, limpios y avanzar
        req[target] = value;
        next();
    };
}

export default validate;