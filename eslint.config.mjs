import { dirname } from "path";
import { fileURLToPath } from "url";
import coreWebVitals from "eslint-config-next/core-web-vitals";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  ...coreWebVitals,
  {
    rules: {
      // Experimental React-Compiler rule (bundled in eslint-config-next 16).
      // Misfires on extracted DOM-navigation event handlers
      // (window.open / window.location in onClick), which are valid React.
      "react-hooks/immutability": "off",
    },
  },
];
