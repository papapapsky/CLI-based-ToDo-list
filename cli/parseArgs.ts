export interface cliArgs {
  command?: string;
  flags: Record<string, string | boolean>;
}

export const parseArgs = (argv: string[]): cliArgs => {
  const args = argv.slice(2);
  const command = args[0];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2);
    const next = args[i + 1];

    if (!next || next.startsWith("--")) {
      flags[key] = true;
    } else {
      flags[key] = next;
      i++;
    }
  }

  return { command, flags };
};
