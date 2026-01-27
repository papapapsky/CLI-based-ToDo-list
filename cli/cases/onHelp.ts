import chalk from "chalk";

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

  console.table(commands);
  console.log(
    "For more information go to my github -",
    chalk.blueBright("https://github.com/papapapsky/CLI-based-ToDo-list"),
  );
};
