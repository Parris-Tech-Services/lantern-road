import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const workflowsDir = path.join(root, ".github", "workflows");
const failures = [];

const minimumMajors = new Map([
  ["actions/checkout", 5],
  ["actions/setup-node", 5]
]);

function fail(message) {
  failures.push(message);
}

function workflowFiles() {
  if (!fs.existsSync(workflowsDir)) return [];
  return fs.readdirSync(workflowsDir, { withFileTypes: true })
    .filter(entry => entry.isFile() && /\.ya?ml$/i.test(entry.name))
    .map(entry => path.join(workflowsDir, entry.name));
}

const files = workflowFiles();

for (const fullPath of files) {
  const relative = path.relative(root, fullPath).split(path.sep).join("/");
  const workflowLines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/);

  workflowLines.forEach((line, index) => {
    const match = line.match(/\buses:\s*["\']?([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)@([^\s"\'#]+)["\']?/);
    if (!match) return;

    const action = match[1].toLowerCase();
    const ref = match[2];
    const minimum = minimumMajors.get(action);
    if (!minimum) return;

    const majorMatch = ref.match(/^v(\d+)(?:\.|$)/i);
    if (!majorMatch) {
      // SHA pins and non-v tags are not rejected here because the runtime major
      // cannot be inferred safely from workflow text alone.
      return;
    }

    const major = Number(majorMatch[1]);
    if (major < minimum) {
      fail(relative + ":" + (index + 1) + ": " + match[1] + "@" + ref +
        " uses major v" + major + "; minimum supported major is v" + minimum +
        " (Node-24-compatible action runtime).");
    }
  });
}

if (failures.length) {
  console.error("GitHub Actions runtime validation failed with " + failures.length + " problem(s):");
  for (const message of failures) console.error("- " + message);
  process.exit(1);
}

console.log(
  "GitHub Actions runtime versions OK across " + files.length + " workflow file(s). " +
  "Minimums: actions/checkout@v5+, actions/setup-node@v5+."
);
