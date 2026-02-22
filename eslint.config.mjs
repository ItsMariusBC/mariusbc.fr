import { dirname } from "path";
import { fileURLToPath } from "url";
import coreWebVitals from "eslint-config-next/core-web-vitals";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  ...coreWebVitals,
];
