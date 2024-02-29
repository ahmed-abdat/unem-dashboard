import { fetchPostes } from "@/app/action";
import NewsCards from "@/components/dashboard/overview/NewsCards";
import LoadMore from "@/components/dashboard/overview/LoadMoreNews";

export default async function Student() {
    const { postes, lastDocId } = await fetchPostes("student-space");
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <NewsCards postes={postes} isStudent={true}/>
      </div>
      <LoadMore lastDocId={lastDocId} isStudent={true}/>
    </>
  );
}
