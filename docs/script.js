function escapeLatex(text) {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}

function parseTable(input) {
  input = input.trim();
  if (!input) return [];

  let lines = input.split(/\r?\n/);
  let table = lines.map(line => line.split("\t"));

  if (table.length > 0 && table[0].length === 1) {
    table = lines.map(line => line.split(","));
  }

  return table;
}

function generateLatex(table, useHline) {
  if (table.length === 0) return "";

  const cols = table[0].length;
  const colFormat = "|" + "c|".repeat(cols);

  let latex = "";
  latex += "\\begin{tabular}{" + colFormat + "}\n";

  if (useHline) latex += "\\hline\n";

  table.forEach(row => {
    const escaped = row.map(c => escapeLatex(c.trim()));
    latex += escaped.join(" & ") + " \\\\\n";
    if (useHline) latex += "\\hline\n";
  });

  latex += "\\end{tabular}";
  return latex;
}

document.getElementById("convertBtn").addEventListener("click", () => {
  const input = document.getElementById("input").value;
  const useHline = document.getElementById("useHline").checked;

  const table = parseTable(input);
  const latex = generateLatex(table, useHline);

  document.getElementById("output").value = latex;
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("Copied!");
});