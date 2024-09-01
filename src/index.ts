import { app } from "./app";

app.start().catch((e) => {
    console.error("Error starting the app:", e);
    process.exit(1);
});
