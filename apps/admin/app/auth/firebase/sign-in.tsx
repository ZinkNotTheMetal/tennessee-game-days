import { FirebaseAuthorization } from "@repo/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default async function signIn(email: string, password: string)  {
    return signInWithEmailAndPassword(FirebaseAuthorization(), email, password)
}
