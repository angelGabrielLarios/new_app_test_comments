import { openAI } from "./openAI.js";

export async function isCommentOffensive(comment = 'hola') {
    try {
        const completion = await openAI.chat.completions.create({
            messages: [{ role: "system", content: `Calificame este comentario que esta en el idioma español si tiene groserías, si es obseno, si le desea la muerte a una persona o un grupo de personas, si es racista, si es machista, si insista a la violencia, si pretente lastimar física o emocional, si es así devuelveme solo un 1  y 0 que es un comentario que NO tiene las características anteriores. El comentario es "${comment}"` }],
            model: "gpt-3.5-turbo",
        })

        const { message: { content } } = completion.choices[0]
        /* comentarios */
        const response = Boolean(Number(content))
        return response

    } catch (error) {
        console.error('aqui hubo un error')
        console.error(error)
        throw new Error(error)
    }
}




