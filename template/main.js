window.addEventListener("DOMContentLoaded", () => {
  // create the nav
  const nav = document.createElement("nav");

  // Create the toggle button dynamically
  const toggle = document.createElement("button");
  toggle.id = "toggle-sidebar";
  toggle.setAttribute("aria-label", "Toggle sidebar");
  toggle.innerHTML = "❮"; // arrow icon

  // Restore initial state from localStorage
  const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
  if (isCollapsed) {
    document.documentElement.classList.add("sidebar-collapsed");
    toggle.style.transform = "rotate(180deg)";
  }

  document.body.appendChild(nav);
  document.body.appendChild(toggle);

  // Handle toggling
  toggle.addEventListener("click", () => {
    const root = document.documentElement;
    const isCollapsed = root.classList.toggle("sidebar-collapsed");
    localStorage.setItem("sidebar-collapsed", isCollapsed);
    toggle.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
  });

  nav.classList.add("ready");

  init();
});

const DETAILS_STATE_KEY = "nav:details-open";

function loadDetailsState() {
  try {
    return JSON.parse(localStorage.getItem(DETAILS_STATE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveDetailsState(state) {
  localStorage.setItem(DETAILS_STATE_KEY, JSON.stringify(state));
}

// 1) Grab every demo entrypoint
const globMap = import.meta.glob("./src/**/index.html");

// 2) Build a nested tree from the paths
function buildTree(paths) {
  const root = {};
  for (const fullPath of paths) {
    const parts = fullPath.replace("./src/", "").split("/");
    parts.pop(); // Drop trailing "index.html"

    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLeaf = i === parts.length - 1;

      // Make sure node exists
      if (!cur[part]) cur[part] = { __children: {}, __leaf: null };

      if (isLeaf) {
        // Store the actual file path at the leaf
        cur[part].__leaf = fullPath;
      }

      // Descend
      cur = cur[part].__children;
    }
  }
  return root;
}

// 3) Pretty-labels
function titleize(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

// 4) Render the tree to nested <details>
function renderTree(
  node,
  container,
  { openAll = true, state = {}, parentKey = "" } = {}
) {
  const entries = Object.entries(node).sort(([a], [b]) => a.localeCompare(b));

  for (const [name, meta] of entries) {
    const hasChildren = Object.keys(meta.__children).length > 0;
    const isLeafOnly = !!meta.__leaf && !hasChildren;
    const key = parentKey ? `${parentKey}/${name}` : name; // stable key per folder

    if (isLeafOnly) {
      container.appendChild(makeLink(meta.__leaf, titleize(name)));
    } else {
      const details = document.createElement("details");

      // restore persisted state; fall back to openAll if unknown
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        details.open = !!state[key];
      } else {
        details.open = openAll;
      }

      // persist on toggle
      details.addEventListener("toggle", () => {
        state[key] = details.open;
        saveDetailsState(state);
      });

      const summary = document.createElement("summary");
      summary.textContent = titleize(name);
      details.appendChild(summary);

      if (meta.__leaf) {
        details.appendChild(makeLink(meta.__leaf, titleize(name)));
      }

      renderTree(meta.__children, details, { openAll, state, parentKey: key });
      container.appendChild(details);
    }
  }
}

function makeLink(src, label) {
  const a = document.createElement("a");
  a.href = "#";
  a.dataset.src = src; // used by click handler
  a.textContent = label;
  a.classList.add("nav-link");
  return a;
}

// 5) Boot
function init() {
  // hide/show Nav UI
  const nav = document.querySelector("nav");

  // Build and render the nav
  const paths = Object.keys(globMap);
  const tree = buildTree(paths);
  const detailsState = loadDetailsState();

  nav.querySelectorAll("details, a").forEach((el) => el.remove());
  renderTree(tree, nav, { openAll: true, state: detailsState, parentKey: "" });

  // Wire up click → iframe switching + selected state
  const iframe = document.getElementById("demo-frame");
  const defaultDemo = paths[0];

  const savedSrc = localStorage.getItem("current-demo") || defaultDemo;

  function setSelected(src) {
    // update iframe + localStorage
    iframe.src = src;
    localStorage.setItem("current-demo", src);
    // update selected class
    nav.querySelectorAll("a.nav-link").forEach((a) => {
      a.classList.toggle("selected", a.dataset.src === src);
    });
  }

  // initial selection (after nav is built)
  setSelected(savedSrc);

  // delegate clicks
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a.nav-link");
    if (!a) return;
    e.preventDefault();
    setSelected(a.dataset.src);
  });
}
