import { NewsPoste } from "@/types/news-poste";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

export default function NewCard({ poste }: { poste: NewsPoste }) {

  const mainUrl = "http://localhost:3000";


  const url = new URL(`${mainUrl}/overview`);
  url.searchParams.set("postId", poste?.id?.toString() ?? "0");
  url.searchParams.set("openModal", "true");

  const updateUrl = new URL(`${mainUrl}/news`);
  updateUrl.searchParams.set("postId", poste?.id?.toString() ?? "0");

  return (
    <Card key={poste.id} className="flex flex-col justify-between">
      <CardHeader className="p-2">
        <div className="relative w-full max-w-full overflow-hidden h-40 rounded-md object-cover">
          <Image
            src={poste?.thumbnail?.url ?? poste.images[0]?.url}
            alt={poste?.thumbnail?.name ?? poste.images[0]?.name}
            className="object-cover rounded-md"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 30vw"
            priority={true}
            loading="eager"
          />
        </div>
        <CardDescription className="font-aljazira font-semibold text-lg">
          {poste.title}
        </CardDescription>
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
