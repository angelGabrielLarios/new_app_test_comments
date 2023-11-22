import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebaseConfig"
export const getPostById = async ({ idPost = "" }) => {

    try {
        const postRef = doc(db, "posts", idPost)
        const postDoc = await getDoc(postRef)
        return postDoc.data()
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}
