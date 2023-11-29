let modelo = null;
let tokenizerConfig = null;
const vocabSize = 484;  // Tamaño del vocabulario
const max_length = 18;  // Longitud máxima de los comentarios

// Cargar el modelo
(async () => {
    console.log("Cargando el modelo...");
    modelo = await tf.loadLayersModel("model.json");
    console.log("Modelo cargado!");

    // Cargar la configuración del tokenizer
    try {
        const response = await fetch('tokenizer_config.json');
        tokenizerConfig = await response.json();
        console.log("Configuración del tokenizer cargada");
    } catch (error) {
        console.error('Error al cargar la configuración del tokenizer:', error);
    }
})();

// Función para preprocesar comentarios antes de enviarlos al modelo
function preprocesarComentario(comentario) {
    if (tokenizerConfig !== null) {
        const palabras = comentario.split(' ');
        const secuenciaNumerica = palabras.map(palabra => {
            const indice = tokenizerConfig[palabra] || 0; // Si la palabra no está en el tokenizer, se asigna el token de relleno (0)
            return indice;
        });

        // Aplicar padding si es necesario para igualar la longitud máxima
        while (secuenciaNumerica.length < max_length) {
            secuenciaNumerica.push(0); // Usar el token de relleno (o PAD) utilizado durante el entrenamiento
        }

        return secuenciaNumerica;
    } else {
        console.error("Configuración del tokenizer no cargada");
        return null;
    }
}

// Función para hacer la predicción
async function predecirComentario(comentarioProcesado) {
    if (modelo !== null) {
        if (comentarioProcesado !== null) {
            // Convertir el comentario preprocesado a un tensor
            const tensor = tf.tensor2d([comentarioProcesado], [1, max_length]);

            // Realizar la predicción
            const prediccion = modelo.predict(tensor);

            // Obtener la etiqueta predicha
            const etiquetas = ['Negativo', 'Neutro', 'Positivo'];
            const indiceEtiquetaPredicha = tf.argMax(prediccion, axis = 1).dataSync()[0];
            const etiquetaPredicha = etiquetas[indiceEtiquetaPredicha];

            return etiquetaPredicha;
        } else {
            console.error("Comentario no procesado");
            return "Error";
        }
    } else {
        console.error("Modelo no cargado");
        return "Error";
    }
}

// Ejemplo de uso
(async () => {
    // Esperar a que se cargue el modelo y la configuración del tokenizer
    while (modelo === null || tokenizerConfig === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms antes de verificar nuevamente
    }

    const verificarComentario = document.getElementById("btnEnviar");

    verificarComentario.onclick = () => {
        const nuevoComentario = document.getElementById('comment').value;
        const comentarioProcesado = preprocesarComentario(nuevoComentario);

        if (comentarioProcesado !== null) {
            predecirComentario(comentarioProcesado).then(etiqueta => {
                const resultado = document.getElementById("resultado");
                resultado.innerHTML = `El comentario: '${nuevoComentario}' se clasifica como: ${etiqueta}`;
                //resultado.innerHTML = `${etiqueta}`;
            });
        } else {
            document.getElementById("resultado").innerHTML = "Intenta de nuevo en un rato...";
        }
    };


})();