// --- Project namespace ---
const PROJECT_KEY = import.meta.env?.VITE_PROJECT_NAME || "three-sketchbook";
const storageKey = (name) => `${PROJECT_KEY}:${name}`;

// --- DOM Setup ---
window.addEventListener("DOMContentLoaded", () => {
  // Create sidebar and toggle dynamically
  const nav = document.createElement("nav");
  const toggle = document.createElement("button");
  toggle.id = "toggle-sidebar";
  toggle.setAttribute("aria-label", "Toggle sidebar");
  toggle.innerHTML = "❮";

  // Restore sidebar state
  const isCollapsed =
    localStorage.getItem(storageKey("sidebar-collapsed")) === "true";
  if (isCollapsed) {
    document.documentElement.classList.add("sidebar-collapsed");
    toggle.style.transform = "rotate(180deg)";
  }

  // Add elements to DOM
  document.body.appendChild(nav);
  document.body.appendChild(toggle);

  // Handle toggle
  toggle.addEventListener("click", () => {
    const root = document.documentElement;
    const collapsed = root.classList.toggle("sidebar-collapsed");
    localStorage.setItem(storageKey("sidebar-collapsed"), collapsed);
    toggle.style.transform = collapsed ? "rotate(180deg)" : "rotate(0deg)";
  });

  nav.classList.add("ready");
  init();
});

// --- Persistent <details> state ---
const DETAILS_STATE_KEY = storageKey("nav:details-open");

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

// --- Build navigation tree ---
const globMap = import.meta.glob("./src/**/script.ts");

function buildTree(paths) {
  const root = {};
  for (const fullPath of paths) {
    const parts = fullPath.replace("./src/", "").split("/");
    parts.pop(); // drop trailing script.ts

    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLeaf = i === parts.length - 1;

      if (!cur[part]) cur[part] = { __children: {}, __leaf: null };
      if (isLeaf) cur[part].__leaf = fullPath;
      cur = cur[part].__children;
    }
  }
  return root;
}

function titleize(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

function renderTree(
  node,
  container,
  { openAll = true, state = {}, parentKey = "" } = {}
) {
  const entries = Object.entries(node).sort(([a], [b]) => a.localeCompare(b));

  for (const [name, meta] of entries) {
    const hasChildren = Object.keys(meta.__children).length > 0;
    const isLeafOnly = !!meta.__leaf && !hasChildren;
    const key = parentKey ? `${parentKey}/${name}` : name;

    if (isLeafOnly) {
      container.appendChild(makeLink(meta.__leaf, titleize(name)));
    } else {
      const details = document.createElement("details");

      if (Object.prototype.hasOwnProperty.call(state, key)) {
        details.open = !!state[key];
      } else {
        details.open = openAll;
      }

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
  a.dataset.src = src;
  a.textContent = label;
  a.classList.add("nav-link");
  return a;
}

// --- Initialize sidebar + iframe ---
function init() {
  const nav = document.querySelector("nav");
  const iframe = document.getElementById("demo-frame");

  const paths = Object.keys(globMap);
  const tree = buildTree(paths);
  const detailsState = loadDetailsState();

  nav.querySelectorAll("details, a").forEach((el) => el.remove());
  renderTree(tree, nav, { openAll: true, state: detailsState, parentKey: "" });

  const defaultDemo = paths[0];
  const savedSrc =
    localStorage.getItem(storageKey("current-demo")) || defaultDemo;

  function setSelected(src) {
    iframe.src = `/demo-template.html?script=${encodeURIComponent(src)}`;
    localStorage.setItem(storageKey("current-demo"), src);
    nav.querySelectorAll("a.nav-link").forEach((a) => {
      a.classList.toggle("selected", a.dataset.src === src);
    });
  }

  setSelected(savedSrc);

  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a.nav-link");
    if (!a) return;
    e.preventDefault();
    setSelected(a.dataset.src);
  });
}
