import argparse

def escape_latex(text: str) -> str:
    return (
        text.replace("\\", "\\textbackslash{}")
            .replace("&", "\\&")
            .replace("%", "\\%")
            .replace("$", "\\$")
            .replace("#", "\\#")
            .replace("_", "\\_")
            .replace("{", "\\{")
            .replace("}", "\\}")
            .replace("^", "\\textasciicircum{}")
            .replace("~", "\\textasciitilde{}")
    )

def parse_table(text: str):
    text = text.strip()
    if not text:
        return []

    lines = text.splitlines()
    table = [line.split("\t") for line in lines]

    # タブが無いならCSVとして処理
    if table and len(table[0]) == 1:
        table = [line.split(",") for line in lines]

    return table

def generate_latex(table, use_hline=True):
    if not table:
        return ""

    cols = len(table[0])
    col_format = "|" + "c|" * cols

    out = []
    out.append(f"\\begin{{tabular}}{{{col_format}}}")

    if use_hline:
        out.append("\\hline")

    for row in table:
        row = [escape_latex(cell.strip()) for cell in row]
        out.append(" & ".join(row) + " \\\\")
        if use_hline:
            out.append("\\hline")

    out.append("\\end{tabular}")
    return "\n".join(out)

def main():
    parser = argparse.ArgumentParser(description="Convert Excel copied table to LaTeX tabular.")
    parser.add_argument("file", help="input text file (tab-separated or csv)")
    parser.add_argument("--no-hline", action="store_true", help="disable hline output")
    args = parser.parse_args()

    with open(args.file, "r", encoding="utf-8") as f:
        text = f.read()

    table = parse_table(text)
    latex = generate_latex(table, use_hline=not args.no_hline)

    print(latex)

if __name__ == "__main__":
    main()