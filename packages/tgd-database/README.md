# TGD Prisma DB

## How to migrate?

1. Set .env.local to localhost for debugging purposes first
2. Run the following commands

    ```bash
    pnpm db:migrate
    pnpm db:generate
    ```

3. Go to the top of the `prisma.schema` file and uncomment each of the outputs
4. Run again at the production level (all three steps above)