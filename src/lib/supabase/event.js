import { supabase } from "./supabaseClient";

export default function EventPage({ user }) {
  if (!user) {
    return <p>You must be logged in to see this event.</p>;
  }
  return <h1>Welcome to the Event, {user.email}!</h1>;
}

export async function getServerSideProps({ req }) {
  const { data: { user } } = await supabase.auth.getUser();

  return { props: { user } };
}
