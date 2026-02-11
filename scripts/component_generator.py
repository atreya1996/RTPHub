#!/usr/bin/env python
import argparse
from pathlib import Path

TEMPLATE = """import type { ReactNode } from \"react\";
\nexport default function {name}({{ children }}: {{ children?: ReactNode }}) {{
  return (
    <div className=\"rounded-card border border-border bg-surface p-4\">{name} {{children}}</div>
  );
}}
"""

def main():
  parser = argparse.ArgumentParser(description="Generate component scaffolds.")
  parser.add_argument("name", help="Component name")
  parser.add_argument("--out", default="components", help="Output directory")
  args = parser.parse_args()

  out_dir = Path(args.out)
  out_dir.mkdir(parents=True, exist_ok=True)
  out_file = out_dir / f"{args.name}.tsx"
  out_file.write_text(TEMPLATE.format(name=args.name))
  print(f"Generated {out_file}")

if __name__ == "__main__":
  main()
