import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader() {
  return json(await getTeams());
}

export default function Teams() {
  return (
    <TeamsView teams={useLoaderData<typeof loader>()} />
  );
}
