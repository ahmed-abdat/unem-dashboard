import { Separator } from "@/components/ui/separator";
import {CreatStudentSpacePoste} from '@/components/dashboard/edit/student-space/CreatStudentSpacePoste'
import {UpdatePoste} from '@/components/dashboard/edit/student-space/StudentPosteUpdate'

export default function StudentSpace({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const studetnPosteId = searchParams.studetnPosteId;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium"> فضاء الطالب </h3>
        <p className="text-sm text-muted-foreground">
          إنشاء وتعديل المنشورات والمقالات الخاصة بفضاء الطالب
        </p>
      </div>
      <Separator />
      {studetnPosteId ? <UpdatePoste postId={studetnPosteId as string} /> : <CreatStudentSpacePoste />}
    </div>
  );
}
