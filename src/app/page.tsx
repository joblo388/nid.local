import { HomepageView } from "@/components/HomepageView";
import { posts } from "@/lib/data";

export default function HomePage() {
  const postsTries = [...posts].sort(
    (a, b) => new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime()
  );

  return <HomepageView posts={postsTries} />;
}
