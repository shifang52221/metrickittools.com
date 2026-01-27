export function GET(): Response {
  return new Response("Not found", {
    status: 404,
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
    },
  });
}

