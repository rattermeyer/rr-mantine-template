import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { patchCssModules } from "vite-css-modules"; // see
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	optimizeDeps: {
		esbuildOptions: {
			target: "es2022",
		},
	},
	plugins: [patchCssModules(), tailwindcss(), reactRouter(), tsconfigPaths()],
});
