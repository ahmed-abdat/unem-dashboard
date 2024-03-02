import {
  Card,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { Filiers } from "@/types/filiers-tabel";
import { MAINROUTE } from "@/constant/route";

export default function InstitutionsCard({ poste , posteIde }: { poste: Filiers , posteIde: string}) {
  const mainUrl = MAINROUTE;
  const posteId = "postId";
  const collectionName = "faculiters";

  const url = new URL(`${mainUrl}/overviews/${"institutions"}`);
  url.searchParams.set(posteId, posteIde ?? "0");
  url.searchParams.set("openModal", "true");
  url.searchParams.set("collectionName", collectionName);
  url.searchParams.set("filiereId", poste?.name?.toString() ?? "0");

  const updateUrl = new URL(`${mainUrl}/institutions`);
  updateUrl.searchParams.set(posteId, posteIde ?? "0");
  updateUrl.searchParams.set("collectionName", collectionName);
  updateUrl.searchParams.set("filiereId", poste?.name?.toString() ?? "0");

  return (
    <Card key={poste.name} className="flex flex-col justify-between">
      <CardHeader className="p-2">
        <div className="relative w-full max-w-full overflow-hidden h-40 rounded-md object-cover">
          <Image
            src={poste.url}
            alt={poste.name}
            className="object-cover rounded-md"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw"
            priority={true}
            loading="eager"
          />
        </div>
        <h3>{poste.name}</h3>
      </CardHeader>
      <CardFooter className="grid gap-6">
        <div className="flex justify-start items-center gap-x-3">
          <Button variant="outline" asChild>
            <Link href={updateUrl.toString()} scroll={false}>
              <Edit size={14} />
            </Link>
          </Button>
          <Button variant="destructive" asChild>
            <Link href={url.toString()} scroll={false}>
              <Trash size={14} />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
