import { fetchPostes } from "@/app/action";
import NewsCards from "@/components/dashboard/overview/NewsCards";
import LoadMore from "@/components/dashboard/overview/LoadMoreNews";

export default async function Poste() {
    const { postes, lastDocId } = await fetchPostes('postes'); 
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
        <NewsCards postes={postes} />
      </div>
      <LoadMore lastDocId={lastDocId} />
    </>
  );
}
