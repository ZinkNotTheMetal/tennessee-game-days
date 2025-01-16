import { FirebaseAuthorization } from "@repo/firebase"
import type { UserCredential } from "firebase/auth"
import { createUserWithEmailAndPassword } from "firebase/auth"

export default async function signUp(email: string, password: string) : Promise<UserCredential> {
    return createUserWithEmailAndPassword(FirebaseAuthorization(), email, password)
}
