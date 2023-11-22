import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "./firebaseConfig"

export const getCommentsByIdPost = async ({ idPost = "" }) => {
    try {
        const commentsRef = collection(db, "comments")

        const q = query(commentsRef, where("idPost", "==", idPost), orderBy('dateCommeted', 'desc'));

        const querySnapshot = await getDocs(q)


        const data = querySnapshot.docs.map(doc => doc.data())

        return data
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }

}
