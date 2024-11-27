import { supabase } from "@/lib/supabaseClient";

export default async function Home() {
  const { data: orgs, error: userError } = await supabase
    .from("organisation")
    .select("*");
  const { data: users, error: orgsError } = await supabase
    .from("users")
    .select("*");

  if (userError || orgsError) {
    return Error("Error fetching data.");
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-5">Database setup check</h1>
      <h2 className="text-2xl mb-5">Data fetching</h2>
      <div className="mb-10">
        <h3 className="text-xl">1. Organisations created:</h3>
        {orgs && orgs.map((org) => (
          <div key={org.id}>
            <p>{org.name}</p>
            <p>{org.plan}</p>
            <p>{org.status}</p>
            <p>{new Date(org.created_at).toDateString()}</p>
            <p>{new Date(org.updated_at).toDateString()}</p>
          </div>
        ))}
      </div>
      <div className="mb-10">
        <h3 className="text-xl">1. Users created:</h3>
        {users && users.map(async (user) => (
          <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>
              Oraganisation:{" "}
              {user.organisation_id &&
                (
                  await supabase
                    .from("organisation")
                    .select("name")
                    .eq("id", user.organisation_id)
                ).data?.[0]?.name}
            </p>
            <p>{new Date(user.updated_at).toDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
