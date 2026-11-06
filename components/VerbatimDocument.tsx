import { pageContainer } from "@/lib/layout";

function isBullet(line: string) {
  return line.startsWith("* ");
}

function isSectionHeading(line: string) {
  return /^\d+\.\s+\S/.test(line) && !/[.!;]$/.test(line) && line.length < 110;
}

function isQuestion(line: string) {
  return line.endsWith("?") && line.length < 150;
}

function isMeta(line: string) {
  return /^(Effective Date|Last Updated):/i.test(line);
}

function LineText({ text }: { text: string }) {
  const parts = text.split(
    /(https?:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+\d[\d\s().-]{8,}\d)/gi,
  );
  return parts.map((part, index) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={index} href={part} className="font-medium text-accent underline decoration-primary underline-offset-4">
          {part}
        </a>
      );
    }
    if (part.includes("@") && part.includes(".")) {
      return (
        <a key={index} href={`mailto:${part}`} className="font-medium text-accent underline decoration-primary underline-offset-4">
          {part}
        </a>
      );
    }
    if (/^\+\d/.test(part)) {
      return (
        <a key={index} href={`tel:${part.replace(/[^\d+]/g, "")}`} className="font-medium text-accent underline decoration-primary underline-offset-4">
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

type Block =
  | { type: "p"; text: string; kind: "meta" | "question" | "body" }
  | { type: "ul"; items: string[] };

type Section = { title: string | null; blocks: Block[] };

function blocksFrom(lines: string[]) {
  const blocks: Block[] = [];
  for (const line of lines) {
    if (isBullet(line)) {
      const text = line.slice(2);
      const previous = blocks[blocks.length - 1];
      if (previous?.type === "ul") previous.items.push(text);
      else blocks.push({ type: "ul", items: [text] });
      continue;
    }
    const kind = isMeta(line) ? "meta" : isQuestion(line) ? "question" : "body";
    blocks.push({ type: "p", text: line, kind });
  }
  return blocks;
}

function sectionsFrom(lines: string[]) {
  const sections: Section[] = [];
  let current: Section = { title: null, blocks: [] };
  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (current.title || current.blocks.length) sections.push(current);
      current = { title: line, blocks: [] };
      continue;
    }
    const piece = blocksFrom([line]);
    const block = piece[0];
    if (!block) continue;
    if (block.type === "ul") {
      const previous = current.blocks[current.blocks.length - 1];
      if (previous?.type === "ul") previous.items.push(...block.items);
      else current.blocks.push(block);
      continue;
    }
    current.blocks.push(block);
  }
  if (current.title || current.blocks.length) sections.push(current);
  return sections;
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "ul") {
    return (
      <ul className="space-y-2">
        {block.items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              <LineText text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.kind === "meta") {
    return (
      <p className="text-sm font-semibold tracking-wide text-accent">
        <LineText text={block.text} />
      </p>
    );
  }
  if (block.kind === "question") {
    return (
      <p className="rounded-lg border border-primary/50 bg-primary/25 px-4 py-3 font-medium">
        <LineText text={block.text} />
      </p>
    );
  }
  return (
    <p>
      <LineText text={block.text} />
    </p>
  );
}

export function VerbatimDocument({ lines }: { lines: string[] }) {
  const [title, ...rest] = lines;
  const sections = sectionsFrom(rest);

  return (
    <article>
      <header className="border-b border-primary/50 bg-primary text-primary-foreground">
        <div className={pageContainer("py-14 sm:py-20")}>
          <h1 className="font-display max-w-3xl text-balance text-4xl leading-[1.05] sm:text-6xl">
            {title}
          </h1>
        </div>
      </header>
      <div className="bg-primary/15">
        <div className={pageContainer("mx-auto max-w-3xl space-y-5 py-10 sm:py-14")}>
          {sections.map((section, index) => (
            <section
              key={section.title ?? `lead-${index}`}
              className="rounded-xl border border-primary/40 bg-card px-5 py-6 shadow-sm sm:px-7"
            >
              {section.title ? (
                <h2 className="font-display mb-4 border-l-4 border-primary pl-4 text-2xl leading-tight text-accent">
                  {section.title}
                </h2>
              ) : null}
              <div className="space-y-3 text-[15px] leading-[1.75]">
                {section.blocks.map((block, blockIndex) => (
                  <BlockView key={blockIndex} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
