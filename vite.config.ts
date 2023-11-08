import netlify from "solid-start-netlify";

import solid from "solid-start/vite";
import { defineConfig } from "vite";
import statics from "solid-start-static";
// import solidPlugin from "vite-plugin-solid";

// export default defineConfig({
//   plugins: [solid()],
// });

export default defineConfig({
  // plugins: [
  //   solid({
  //     adapter: netlify({ edge: true }),
  //   }),
  // ],

  plugins: [solid({ adapter: "solid-start-static" })],
  server: {
    port: 3034,
  },
  // build: {
  //   target: 'esnext',
  // },
});

// import { defineConfig } from "vite";
// import deno from "npm:vite-plugin-deno";
// import solidPlugin from "npm:vite-plugin-solid";

// export default defineConfig({
//   plugins: [deno({ version: "1.14.0" }), solidPlugin()],
//   server: {
//     port: 3034,
//   },
// });
