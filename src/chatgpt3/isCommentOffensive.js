import { openAI } from "./openAI.js";

export async function isCommentOffensive(comment = 'hola') {
    try {
        const completion = await openAI.chat.completions.create({


            messages: [{ role: "system", content: `Te proporcionaré un comentario en español proveniente de México. Tu tarea consistirá en analizar el contexto del comentario para identificar las siguientes características: si contiene expresiones de odio hacia una persona o grupo, si discrimina a alguien o a un grupo de personas, si es obsceno, si implica acoso sexual, si tiene la intención de dañar a una persona o grupo, y si ofende la orientación sexual de alguien o un grupo de personas. Finalmente, determina si incluye groserías ofensivas hacia alguien o un grupo de personas. Si el comentario cumple con alguna de estas características, devuelve el número 1; si es un comentario neutro que no cumple con ninguna de las características mencionadas, devuelve un 0. Simplemente devuelve el número sin proporcionar ninguna explicación de la razón por la que lo seleccionaste.El comentario es "${comment}"` }],
            model: "gpt-3.5-turbo",
        })

        const { message: { content } } = completion.choices[0]

        console.log(content)

        const response = Boolean(Number(content))
        return response

    } catch (error) {
        console.error('aqui hubo un error')
        console.error(error)
        throw new Error(error)
    }
}




