import { FirebaseAuthorization } from '@repo/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- copied from youtube
      async authorize(credentials): Promise<any> {
        if (credentials !== undefined) {
          const response = await signInWithEmailAndPassword(FirebaseAuthorization(), credentials.email, credentials.password)
          return response.user;
        }
        return null
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }