export default function CreatorPage({
  params,
}: {
  params: { username: string }
}) {
  return (
    <div>
      <h1>Creator Page</h1>
      <p>Username: {params.username}</p>
    </div>
  );
}