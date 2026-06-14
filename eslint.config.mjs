import { dirname } from "path";
import { fileURLToPath } from "url";
import coreWebVitals from "eslint-config-next/core-web-vitals";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  ...coreWebVitals,
  {
    rules: {
      // Experimental React-Compiler rules (bundled in eslint-config-next 16),
      // both noisy/preview. immutability misfires on extracted DOM-navigation
      // handlers (window.open in onClick); set-state-in-effect flags the
      // standard post-mount client-enhancement pattern. Both are valid React.
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
