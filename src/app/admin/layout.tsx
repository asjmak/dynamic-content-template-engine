import { createServerClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

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
      <div className="theme-toggle-wrap">
        <ThemeToggle />
      </div>
    </div>
  );
}
