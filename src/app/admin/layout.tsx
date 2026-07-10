import { createServerClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      {user && <Navbar />}
      <div className="container admin-body">{children}</div>
    </div>
  );
}
