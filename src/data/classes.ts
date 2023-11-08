import { createResource } from "solid-js";

export function routeData() {
  const [students] = createResource(async () => {
    const response = await fetch("https://hogwarts.deno.dev/students");
    return await response.json();
  });

  return { students };
}
