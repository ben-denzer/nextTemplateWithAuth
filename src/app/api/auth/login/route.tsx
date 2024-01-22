export async function POST(req: Request) {
  const requestHeaders = req.headers;
  const body = await req.json();
  console.log({ requestHeaders, body });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
