import firebaseApp from "./web.init";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

let auth: Auth // ReturnType<typeof getAuth>;

export const FirebaseAuthorization = () : Auth => {
  if (!auth) {
    auth = getAuth(firebaseApp)
    if (process.env.FIREBASE_ENABLE_EMULATOR === "true") {
      connectAuthEmulator(auth, 'localhost')
      console.log('connected to auth emulator...')
    }
  }
  return auth
}

export default FirebaseAuthorization;