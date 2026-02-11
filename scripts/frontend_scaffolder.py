#!/usr/bin/env python
import argparse
from pathlib import Path

REQUIRED_PATHS = [
    "app",
    "components",
    "lib",
    "packs",
    "public",
    "scripts",
    "references",
]


def main():
    parser = argparse.ArgumentParser(description="Scaffold validation and analysis.")
    parser.add_argument("--analyze", action="store_true", help="Run validation checks")
    args = parser.parse_args()

    root = Path.cwd()
    if args.analyze:
        missing = [path for path in REQUIRED_PATHS if not (root / path).exists()]
        if missing:
            print("Missing required paths:")
            for path in missing:
                print(f"- {path}")
            raise SystemExit(1)
        print("Scaffold check passed.")
    else:
        print("Run with --analyze to validate.")

if __name__ == "__main__":
    main()
