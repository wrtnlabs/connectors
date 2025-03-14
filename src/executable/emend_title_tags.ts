import fs from "fs";

interface ISection {
  from: number;
  to: number;
  lines: string[];
} 

const trimLines = (lines: string[]): void => {
  while (true)
    if (lines.length && lines[0].length === 0) lines.shift();
    else break;
  while (true)
    if (lines.at(-1)?.length === 0) lines.pop();
    else break;
};

const findSections = (content: string): ISection[] => {
  const output: ISection[] = [];
  let index: number = 0;
  while (true) {
    // FIND SPECIAL CHARACTERS
    const from: number = content.indexOf("/**", index);
    if (from === -1) break;
    const to: number = content.indexOf("*/", from + 1);
    if (to === -1) break;
    index = to + 1;

    // COLLECT LINES
    const lines: string[] = content
      .substring(from + 3, to)
      .split("\n")
      .map((l) => {
        const x: number = l.indexOf("*");
        return (x === -1 ? l : l.substring(x + 1)).trim();
      });
    trimLines(lines);
    if (lines.length === 0) lines.push("");

    // STORE SECTION
    output.push({
      from,
      to: to + 2,
      lines,
    });
  }
  return output;
};

const emendFile = async (props: {
  kind: "summary" | "title";
  location: string;
}): Promise<void> => {
  const content: string = (await fs.promises.readFile(props.location, "utf8"))
    .split("\r\n")
    .join("\n");
  const sections: ISection[] = findSections(content);
  if (sections.length === 0) return;

  for (const sec of sections) {
    if (sec.lines.length === 0) continue;
    const index: number = sec.lines.findIndex((l) =>
      l.startsWith(`@${props.kind}`),
    );
    if (index === -1) continue;
    const contradict: boolean =
      sec.lines
        .slice(0, index - 1)
        .every((str) => str === "" || str.startsWith("@")) &&
      sec.lines.every((str) => str.startsWith("@description") === false);
    if (contradict) continue;

    const next: number = (() => {
      const next: number = sec.lines.findIndex(
        (l, i) => i > index && l.startsWith("@"),
      );
      return next === -1 ? sec.lines.length : next;
    })();

    const forward: string[] = [
      ...sec.lines.slice(0, index),
      ...sec.lines.slice(index + 1, next),
    ];
    const backword: string[] = [...sec.lines.slice(next)];
    trimLines(forward);
    trimLines(backword);
    sec.lines = [
      ...forward,
      ...(forward.length ? [""] : []),
      sec.lines[index],
      ...backword,
    ];
  }

  const output: string[] = [
    content.substring(0, sections[0].from),
    ...sections.flatMap((s, i) => [
      ["/**", ...s.lines.map((l) => ` * ${l}`), " */"].join("\n"),
      content.substring(s.to, sections.at(i + 1)?.from ?? content.length),
    ]),
  ];
  await fs.promises.writeFile(props.location, output.join(""), "utf8");
};

const visitDirectory = async (props: {
  kind: "summary" | "title";
  directory: string;
}): Promise<void> => {
  for (const file of await fs.promises.readdir(props.directory)) {
    const location: string = `${props.directory}/${file}`;
    const stat: fs.Stats = await fs.promises.lstat(location);
    if (stat.isDirectory() === true)
      await visitDirectory({
        kind: props.kind,
        directory: location,
      });
    else if (file.endsWith(".ts"))
      await emendFile({
        kind: props.kind,
        location,
      });
  }
};

const main = async (): Promise<void> => {
  await visitDirectory({
    kind: "summary",
    directory: `${__dirname}/../controllers`,
  });
  await visitDirectory({
    kind: "title",
    directory: `${__dirname}/../api/structures`,
  });
}; 
main().catch(console.error);
