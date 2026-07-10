import { PrismaClient } from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();
const csvPath = process.argv[2];

if (!csvPath) {
  console.error("Usage: node scripts/import-operator-leads.mjs <csv-path>");
  process.exit(1);
}

const absolutePath = path.resolve(csvPath);
const csv = await fs.readFile(absolutePath, "utf8");
const rows = parseOperatorLeadCsv(csv);

for (const row of rows) {
  await prisma.operatorLead.upsert({
    where: { slug: row.slug },
    create: {
      slug: row.slug,
      name: row.name,
      category: row.category,
      region: row.region,
      email: row.email,
      phone: row.phone,
      claimUrl: row.claimUrl,
      source: "csv",
      status: "IMPORTED",
    },
    update: {
      name: row.name,
      category: row.category,
      region: row.region,
      email: row.email,
      phone: row.phone,
      claimUrl: row.claimUrl,
      source: "csv",
    },
  });
}

await prisma.$disconnect();
console.log(`Imported ${rows.length} operator leads from ${absolutePath}`);

function parseOperatorLeadCsv(csvText) {
  const [headerRow, ...dataRows] = parseCsvRows(csvText).filter((row) =>
    row.some((cell) => cell.trim()),
  );
  const headerIndex = new Map(
    headerRow.map((header, index) => [header.trim().toLowerCase(), index]),
  );

  return dataRows.map((row, index) => {
    const slug = normalizeSlug(getCsvCell(row, headerIndex, "slug"));
    const name = getCsvCell(row, headerIndex, "name").trim();

    if (!slug || !name) {
      throw new Error(`CSV row ${index + 2} is missing slug or name.`);
    }

    return {
      slug,
      name,
      category: optionalString(getCsvCell(row, headerIndex, "category")),
      region: optionalString(getCsvCell(row, headerIndex, "region")),
      email: optionalString(getCsvCell(row, headerIndex, "email"))?.toLowerCase(),
      phone: optionalString(getCsvCell(row, headerIndex, "phone")),
      claimUrl: optionalString(getCsvCell(row, headerIndex, "claim_url")),
    };
  });
}

function parseCsvRows(csvText) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];
    const nextChar = csvText[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function getCsvCell(row, headerIndex, header) {
  const index = headerIndex.get(header);
  return index === undefined ? "" : row[index] ?? "";
}

function optionalString(value) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function normalizeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
