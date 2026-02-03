import chalk from "chalk";
import Table from "cli-table3";

export const onHelpAction = () => {
  const commands = [
    {
      name: "add",
      flags: "--title, --content, --priority",
      description: "for fast-add task",
      examples: "todo add --title 'Do CLI-project'",
    },
    {
      name: "list/tolist",
      flags: "none",
      description: "checking TODO list, 'tolist' for go to list",
      examples: "todo list",
    },
    {
      name: "help",
      flags: "none",
      description: "for check main commands",
      examples: "todo help",
    },
  ];

  const table = new Table({
    head: [
      chalk.yellow("Name"),
      chalk.yellow("Flags"),
      chalk.yellow("Description"),
      chalk.yellow("Examples"),
    ],
    colWidths: [15, 15, 15, 15],
    wordWrap: true,
  });

  commands.forEach((cmd) => {
    table.push([
      chalk.green(cmd.name),
      chalk.cyan(cmd.flags),
      cmd.description,
      chalk.blue(cmd.examples),
    ]);
  });

  console.log(table.toString());

  console.log(
    "\nFor more information go to my github -",
    chalk.blueBright("https://github.com/papapapsky/CLI-based-ToDo-list"),
  );
};
