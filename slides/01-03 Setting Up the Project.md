# Setting Up the Project

Most of what we're going to be doing is working within a terminal. The [agent](https://www.aihero.dev/ai-coding-dictionary/agent) we're going to be running is a terminal program.

The recommended IDE for this course is [Visual Studio Code](https://code.visualstudio.com/). It's been the presenter's tool of choice since 2017 for a few good reasons:

- Completely free
- Works across platforms
- Very approachable
- Has a **built-in terminal**

![Visual Studio Code website at code.visualstudio.com](https://res.cloudinary.com/total-typescript/image/upload/v1786012733/ai-hero-images/bdhhdedelbkpup0ayxuf.png)

If you already have an IDE you're comfortable with, just use that - as long as it has a terminal inside and you can use it to view code, you're good to go.

## The VSCode Terminal

On Mac and Windows you already have a terminal. On Windows, you can also use the Windows Subsystem for Linux (WSL) to get a Linux terminal, giving access to commands like `cd` and `ls`.

Once you have VS Code installed and open, open the integrated terminal from the menu: **View** → **Terminal**. This opens the terminal in whatever folder VS Code currently has open.

There's also a keyboard shortcut - by default it's `` Ctrl+` `` (Windows/Linux) or `` Control (⌃) + ` `` (Mac, using **Control**, not Command). That default is tied to a physical key position, so depending on your keyboard layout it can land on a different key for you (some people find it's the single-quote key instead). If it doesn't do anything when you press it, use the menu above, or search **"Toggle Terminal"** in the Keyboard Shortcuts editor (**Ctrl+K Ctrl+S** / **Cmd+K Cmd+S**) to see - and if you like, change - what's actually bound on your machine.

![VS Code with the integrated terminal panel open](https://res.cloudinary.com/total-typescript/image/upload/v1786012734/ai-hero-images/dgapvaehyrpzheaf1fko.png)

You can drag it up and down, split the editor, or delete and reopen the terminal. Once you have the terminal visible, choose where you want the project directory to go. For example, `cd` into a `repos` folder:

```txt
cd repos/learning
ls
```

Having some basic familiarity with the terminal will be very useful. If that's a weakness for you, head to the Discord for resources.

## Cloning the Project with Git

The project lives on GitHub. You'll need `git` to clone it. Run the following to check whether you have it installed:

```txt
git --version
```

If you don't have `git` installed, a link to download it is provided below.

Once you have `git`, go to the GitHub page for the AI Coding Crash Course. Click the **Code** button, select **HTTPS**, and copy the URL. Then back in the terminal, run:

```txt
git clone https://github.com/ai-hero-dev/ai-coding-crash-course.git
```

![Terminal showing git clone command running and completing](https://res.cloudinary.com/total-typescript/image/upload/v1786012736/ai-hero-images/otzrhq2jheh5tr24wwdf.png)

It should clone into `ai-coding-crash-course`. Once that's done, open the folder in VS Code. You can do this from the terminal with:

```txt
code ai-coding-crash-course
```

You should now see the file explorer on the left-hand side with all the project files.

## Installing Node

This project uses Node.js to run JavaScript on your computer. Check whether you have it installed:

```txt
node --version
```

The current installed version is `22.21.1`. You want an **LTS** (Long-Term Support) version, as it's the most stable. Here's what the version labels mean:

| Label   | Meaning                                      |
| ------- | -------------------------------------------- |
| LTS     | Long-term support - most stable, recommended |
| Current | Latest, fanciest version                     |
| EOL     | End of life - no longer supported            |

You can install Node.js from the [Node.js download page](https://nodejs.org/en/download). Aim for version 22 or 24. If you're having trouble seeing `node` after installing it, kill the terminal and reopen it to refresh the PATH:

```txt
node --version
```

Node ships with `npm` (Node Package Manager). Check it's available too:

```txt
npm --version
```

## Installing Dependencies

With Node installed, run the following inside the project directory to pull down all the necessary packages from the npm package registry:

```txt
npm install
```

This may show some warnings or vulnerability notices - that's normal for npm. Once it's done, you'll see a `node_modules` folder appear in the file tree.

![Terminal showing npm install completing with node_modules folder visible](https://res.cloudinary.com/total-typescript/image/upload/v1786012737/ai-hero-images/noq4gtopk9zufc78tcse.png)

These node modules are packages that people have published on npm. For example, `ai-hero-sandcastle` is one of the packages this project depends on.

## Setting Up the Database

The app stores its data in a local file. A fresh clone doesn't include it, so two commands are needed to build it.

First, create the database by running:

```txt
npm run db:migrate
```

This creates a local `data.db` file in the project root. Then, fill it with seed data:

```txt
npm run db:seed
```

These scripts, along with others, are defined in `package.json`:

```json
{
  "scripts": {
    "db:migrate": "...",
    "db:seed": "...",
    "dev": "..."
  }
}
```

## Running the App

Now run the dev server:

```txt
npm run dev
```

If everything is set up correctly, you'll see a local URL printed, something like `localhost:5173`. You can **Ctrl+click** the URL in VS Code and it will open right inside the IDE.

![VS Code showing the app running at localhost:5175 inside the IDE browser panel](https://res.cloudinary.com/total-typescript/image/upload/v1786012739/ai-hero-images/ilom2uwh2zuowapwatjo.png)

## The Cadence App

This is **Cadence**, the application we'll be building features on throughout this course using AI. It's a reasonably sized application.

Switch it to dark mode to save your eyes.

![Cadence app showing Emma Wilson's dashboard with TypeScript and Node.js courses](https://res.cloudinary.com/total-typescript/image/upload/v1786012740/ai-hero-images/ei1kk0goajesq3dla7hd.png)

One key feature to know about is the **dev UI** at the bottom, which lets you switch the user you're currently logged in as. For instance, logging in as Emma Wilson shows she has access to two courses: TypeScript and Node.js.

The app has been seeded with dummy data - courses, lessons, and users created by Marcus Johnson. Once you can see this dummy data visible inside VS Code, you're done with this lesson.

You have successfully set up all the dependencies of the project. Detailed steps are provided below, and if you run into any issues, head to the [Discord](https://aihero.dev/discord).


