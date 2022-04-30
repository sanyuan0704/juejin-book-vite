import cac from "cac";
import { startDevServer } from "./server";

const cli = cac();

cli
  .command("[root]", "Run the development server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
    await startDevServer();
  });

cli.command("build", "Build the app for production").action(() => {});

cli.help();

cli.parse();
