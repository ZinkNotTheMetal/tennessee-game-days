# Creating a new turbo suite of typescript projects

## Initialize the turbo app using pnpm

```bash
pnpm dlx create-turbo@latest
```

## Project structure

1. apps (applications that live in the mono repository)
2. packages (shared packages that each of the applications can utilize)
3. .vscode (visual studio code folder that can be used to configure VSCode)
4. lot's of additional configuration files

## How to create additional projects in the monorepository

1. Navigate to the apps/ folder
2. Create a new directory
3. Navigate to that directory and create whatever files you prefer

### To start a new nextjs application

```bash
# Be in the apps/ folder
npx create-next-app --use-pnpm
```
