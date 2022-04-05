async function init() {
  const { default: chalk } = await import("chalk");
  console.log(chalk.green("hello world"));
}

init();
