type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  content?: TiptapNode[];
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeMarkdown = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll("*", "\\*").replaceAll("`", "\\`");

const unwrapParagraph = (value: string) => value.replace(/\n{2,}/g, "\n");

const escapeTableCell = (value: string) =>
  value
    .replaceAll("\\|", "|")
    .replaceAll("|", "\\|")
    .replace(/\s*\n+\s*/g, "<br>")
    .trim();

const serializeInline = (nodes: TiptapNode[] = []) =>
  nodes.map(serializeNode).join("");

const serializeListItem = (node: TiptapNode, depth: number) => {
  const children = node.content ?? [];
  const [firstChild, ...restChildren] = children;
  const firstLine =
    firstChild?.type === "paragraph"
      ? serializeInline(firstChild.content)
      : serializeNode(firstChild, depth).trim();
  const rest = restChildren
    .map((child) => serializeNode(child, depth + 1))
    .filter(Boolean)
    .join("\n");

  return rest ? `${firstLine}\n${rest}` : firstLine;
};

const serializeList = (node: TiptapNode, depth: number, ordered: boolean) => {
  const start =
    typeof node.attrs?.start === "number" ? Number(node.attrs.start) : 1;

  return (node.content ?? [])
    .map((item, index) => {
      const marker = ordered ? `${start + index}.` : "-";
      const indent = "  ".repeat(depth);
      const value = serializeListItem(item, depth);
      const [firstLine, ...restLines] = value.split("\n");
      const rest = restLines
        .map((line) => `${indent}  ${line}`)
        .join("\n");

      return rest
        ? `${indent}${marker} ${firstLine}\n${rest}`
        : `${indent}${marker} ${firstLine}`;
    })
    .join("\n");
};

const serializeTableCell = (node: TiptapNode) => {
  return escapeTableCell(
    (node.content ?? [])
      .map((child) =>
        child.type === "paragraph"
          ? serializeInline(child.content)
          : serializeNode(child).trim(),
      )
      .filter(Boolean)
      .join("<br>"),
  );
};

const serializeTableRow = (node: TiptapNode) => {
  return (node.content ?? []).map(serializeTableCell);
};

const serializeTable = (node: TiptapNode) => {
  const rows = (node.content ?? []).map(serializeTableRow);
  if (!rows.length) return "";

  const columnCount = Math.max(...rows.map((row) => row.length));
  const normalizeRow = (row: string[]) => [
    ...row,
    ...Array.from({ length: columnCount - row.length }, () => ""),
  ];
  const [headerRow, ...bodyRows] = rows.map(normalizeRow);
  const renderRow = (row: string[]) => `| ${row.join(" | ")} |`;
  const separator = renderRow(Array.from({ length: columnCount }, () => "---"));

  return [renderRow(headerRow ?? []), separator, ...bodyRows.map(renderRow)].join(
    "\n",
  );
};

const serializeNode = (node?: TiptapNode, depth = 0): string => {
  if (!node) return "";

  switch (node.type) {
    case "doc":
      return (node.content ?? [])
        .map((child) => serializeNode(child, depth))
        .filter(Boolean)
        .join("\n\n");
    case "paragraph":
      return serializeInline(node.content);
    case "heading": {
      const level = typeof node.attrs?.level === "number" ? node.attrs.level : 1;
      return `${"#".repeat(level)} ${serializeInline(node.content)}`;
    }
    case "bulletList":
      return serializeList(node, depth, false);
    case "orderedList":
      return serializeList(node, depth, true);
    case "listItem":
      return serializeListItem(node, depth);
    case "blockquote":
      return serializeNode({ type: "doc", content: node.content }, depth)
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    case "codeBlock": {
      const language =
        typeof node.attrs?.language === "string" ? node.attrs.language : "";
      return `\`\`\`${language}\n${node.text ?? serializeInline(node.content)}\n\`\`\``;
    }
    case "horizontalRule":
      return "---";
    case "table":
      return serializeTable(node);
    case "tableRow":
      return serializeTableRow(node).join(" | ");
    case "tableHeader":
    case "tableCell":
      return serializeTableCell(node);
    case "hardBreak":
      return "  \n";
    case "text": {
      let value = escapeMarkdown(node.text ?? "");
      const marks = node.marks ?? [];

      if (marks.some((mark) => mark.type === "code")) {
        return `\`${value.replaceAll("`", "\\`")}\``;
      }
      if (marks.some((mark) => mark.type === "bold")) value = `**${value}**`;
      if (marks.some((mark) => mark.type === "italic")) value = `*${value}*`;
      if (marks.some((mark) => mark.type === "strike")) value = `~~${value}~~`;

      return value;
    }
    default:
      return serializeInline(node.content);
  }
};

const renderInlineMarkdown = (value: string) => {
  const tokens: string[] = [];
  let html = escapeHtml(value).replace(/`([^`]+)`/g, (_, code: string) => {
    tokens.push(`<code>${code}</code>`);
    return `\u0000${tokens.length - 1}\u0000`;
  });

  html = html
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<s>$1</s>");

  return html.replace(/\u0000(\d+)\u0000/g, (_, index: string) => {
    return tokens[Number(index)] ?? "";
  });
};

const renderParagraphGroup = (lines: string[]) =>
  `<p>${renderInlineMarkdown(lines.join(" "))}</p>`;

const renderList = (lines: string[], ordered: boolean) => {
  const tag = ordered ? "ol" : "ul";
  const items = lines
    .map((line) => line.replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""))
    .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
    .join("");

  return `<${tag}>${items}</${tag}>`;
};

const splitMarkdownTableRow = (line: string) => {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells: string[] = [];
  let current = "";
  let escaped = false;

  for (const char of trimmed) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());

  return cells;
};

const isMarkdownTableSeparator = (line?: string) => {
  if (!line) return false;

  return splitMarkdownTableRow(line).every((cell) =>
    /^:?-{3,}:?$/.test(cell.trim()),
  );
};

const isMarkdownTableRow = (line?: string) => {
  if (!line) return false;

  return line.includes("|") && splitMarkdownTableRow(line).length > 1;
};

const renderTableCellContent = (value: string) =>
  renderInlineMarkdown(value).replace(/&lt;br&gt;/gi, "<br>");

const renderTable = (rows: string[][]) => {
  const [headerRow, ...bodyRows] = rows;
  const renderCells = (row: string[], tag: "td" | "th") =>
    row.map((cell) => `<${tag}>${renderTableCellContent(cell)}</${tag}>`).join("");

  return [
    "<table>",
    headerRow ? `<thead><tr>${renderCells(headerRow, "th")}</tr></thead>` : "",
    bodyRows.length
      ? `<tbody>${bodyRows
          .map((row) => `<tr>${renderCells(row, "td")}</tr>`)
          .join("")}</tbody>`
      : "",
    "</table>",
  ].join("");
};

export const tiptapJsonToMarkdown = (json: TiptapNode) =>
  serializeNode(json).trim();

export const markdownToHtml = (markdown?: string | null) => {
  if (!markdown?.trim()) return "";

  const blocks: string[] = [];
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = escapeHtml(line.slice(3).trim());
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index]?.startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }

      blocks.push(
        `<pre><code${language ? ` class="language-${language}"` : ""}>${escapeHtml(
          codeLines.join("\n"),
        )}</code></pre>`,
      );
      index += 1;
      continue;
    }

    if (/^#{1,3}\s+/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      blocks.push(
        `<h${level}>${renderInlineMarkdown(line.replace(/^#{1,3}\s+/, ""))}</h${level}>`,
      );
      index += 1;
      continue;
    }

    if (
      isMarkdownTableRow(line) &&
      isMarkdownTableSeparator(lines[index + 1])
    ) {
      const tableRows = [splitMarkdownTableRow(line)];
      index += 2;

      while (index < lines.length && isMarkdownTableRow(lines[index])) {
        tableRows.push(splitMarkdownTableRow(lines[index] ?? ""));
        index += 1;
      }

      blocks.push(renderTable(tableRows));
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index] ?? "")) {
        quoteLines.push((lines[index] ?? "").replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote>${markdownToHtml(quoteLines.join("\n"))}</blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const listLines: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index] ?? "")) {
        listLines.push(lines[index] ?? "");
        index += 1;
      }
      blocks.push(renderList(listLines, false));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const listLines: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index] ?? "")) {
        listLines.push(lines[index] ?? "");
        index += 1;
      }
      blocks.push(renderList(listLines, true));
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push("<hr>");
      index += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index]?.trim()) {
      paragraphLines.push(lines[index] ?? "");
      index += 1;
    }
    blocks.push(renderParagraphGroup(paragraphLines));
  }

  return blocks.join("");
};

export const looksLikeHtml = (value?: string | null) =>
  !!value && /<\/?[a-z][\s\S]*>/i.test(value);

export const htmlToMarkdown = (html?: string | null) => {
  if (!html) return "";
  if (typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeMarkdown(node.textContent ?? "");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const element = node as HTMLElement;
    const content = Array.from(element.childNodes).map(walk).join("");

    switch (element.tagName.toLowerCase()) {
      case "table": {
        const rows = Array.from(element.querySelectorAll("tr"))
          .map((row) =>
            Array.from(row.querySelectorAll("th, td")).map((cell) =>
              escapeTableCell(
                Array.from(cell.childNodes)
                  .map(walk)
                  .join("")
                  .replace(/\n{2,}/g, "\n")
                  .trim(),
              ),
            ),
          )
          .filter((row) => row.length);

        if (!rows.length) return "";

        const columnCount = Math.max(...rows.map((row) => row.length));
        const normalizeRow = (row: string[]) => [
          ...row,
          ...Array.from({ length: columnCount - row.length }, () => ""),
        ];
        const [headerRow, ...bodyRows] = rows.map(normalizeRow);
        const renderRow = (row: string[]) => `| ${row.join(" | ")} |`;

        return [
          renderRow(headerRow ?? []),
          renderRow(Array.from({ length: columnCount }, () => "---")),
          ...bodyRows.map(renderRow),
        ].join("\n").concat("\n\n");
      }
      case "p":
        return `${content}\n\n`;
      case "h1":
        return `# ${content}\n\n`;
      case "h2":
        return `## ${content}\n\n`;
      case "h3":
        return `### ${content}\n\n`;
      case "strong":
      case "b":
        return `**${content}**`;
      case "em":
      case "i":
        return `*${content}*`;
      case "s":
      case "strike":
        return `~~${content}~~`;
      case "code":
        return element.closest("pre") ? content : `\`${content}\``;
      case "pre":
        return `\`\`\`\n${element.textContent ?? ""}\n\`\`\`\n\n`;
      case "blockquote":
        return content
          .trim()
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n")
          .concat("\n\n");
      case "li":
        return `- ${unwrapParagraph(content).trim()}\n`;
      case "ul":
      case "ol":
        return `${content}\n`;
      case "br":
        return "  \n";
      case "hr":
        return "---\n\n";
      default:
        return content;
    }
  };

  return Array.from(doc.body.childNodes).map(walk).join("").trim();
};
