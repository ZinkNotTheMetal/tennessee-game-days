# Integrating Next Auth into NextJS

## Integration steps

1. Install next-auth as an npm dependency

    ```bash
    pnpm i next-auth
    ```

2. Add the API Route (api/auth/[...nextAuth]/route.ts)

3. Add the session provider to the layout page (place where children is placed)

    ```tsx
    import { SessionProvider } from "next-auth/react"
    export default function App({
    Component,
    pageProps: { session, ...pageProps },
    }) {
    return (
        <SessionProvider session={session}>
        <Component {...pageProps} />
        </SessionProvider>
    )
    ```

4. 

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
