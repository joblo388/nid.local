import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import { HomepageView } from "@/components/HomepageView";
import { Header } from "@/components/Header";
import { auth } from "@/auth";
import { Sidebar } from "@/components/Sidebar";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const defaultWhere = {};
  const defaultOrderBy = [{ epingle: "desc" as const }, { nbVotes: "desc" as const }];

  const [dbPosts, total, userVotes, userBookmarks] = await Promise.all([
    prisma.post.findMany({ where: defaultWhere, orderBy: defaultOrderBy, take: PAGE_SIZE, include: { auteur: { select: { tag: true } } } }),
    prisma.post.count({ where: defaultWhere }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
    userId ? prisma.bookmark.findMany({ where: { userId }, select: { postId: true } }) : [],
  ]);

  const initialPosts = dbPosts.map(dbPostToAppPost);
  const initialVotedPostIds = userVotes.map((v) => v.postId);
  const initialBookmarkedPostIds = userBookmarks.map((b) => b.postId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "nid.local",
        url: "https://nidlocal.com",
        description: "Le forum immobilier québécois. Discussions entre propriétaires, acheteurs et locataires.",
        inLanguage: "fr-CA",
        potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: "https://nidlocal.com/recherche?q={search_term_string}" }, "query-input": "required name=search_term_string" },
      },
      {
        "@type": "Organization",
        name: "nid.local",
        url: "https://nidlocal.com",
        logo: "https://nidlocal.com/favicon.ico",
        sameAs: [],
        inLanguage: "fr-CA",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Québec, Canada",
        },
        address: {
          "@type": "PostalAddress",
          addressRegion: "QC",
          addressCountry: "CA",
        },
      },
      {
        "@type": "DiscussionForum",
        name: "nid.local",
        url: "https://nidlocal.com",
        description: "Forum immobilier communautaire du Québec. Discussions entre propriétaires, acheteurs et locataires.",
        inLanguage: "fr-CA",
      },
    ],
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <HomepageView
        initialPosts={initialPosts}
        initialTotal={total}
        initialVotedPostIds={initialVotedPostIds}
        initialBookmarkedPostIds={initialBookmarkedPostIds}
        sidebar={<Sidebar />}
      />
    </div>
    </>
  );
}
