import { fetchPostes } from "@/app/action";
import NewsCards from "@/components/dashboard/overview/NewsCards";
import LoadMore from "@/components/dashboard/overview/LoadMoreNews";
import InstitutionsCards from "@/components/dashboard/overview/institutions/InstitutionsCards";
import LoadMoreInstitutions from "@/components/dashboard/overview/institutions/InstitutionsLoadMore";

export default async function Institutions() {
  const { postes, lastDocId } = await fetchPostes("faculiters");
  return (
    <>
      <div className="flex flex-col gap-y-4">
        <InstitutionsCards postes={postes} />
      </div>
      <LoadMoreInstitutions lastDocId={lastDocId} />
    </>
  );
}
