const demos = import.meta.glob("/src/sketches/**/*.ts");

const params = new URLSearchParams(window.location.search);
const scriptPath = params.get("script");

if (!scriptPath) {
  console.warn("No script specified");
} else {
  // Match against the absolute path Vite knows
  const fullKey = Object.keys(demos).find((key) =>
    key.endsWith(scriptPath.replace("./", "/"))
  );
  if (!fullKey) {
    console.error("Demo not found in bundle:", scriptPath);
  } else {
    demos[fullKey]()
      .then((mod) => {
        // Run default export or init if available
        mod.default?.();
      })
      .catch((err) => console.error("Failed to load demo:", scriptPath, err));
  }
}
