import { Separator } from "@/components/ui/separator";
import { CreateNewPoste } from "@/components/dashboard/edit/CreatPoste";

export default function News() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium"> الأخبار </h3>
        <p className="text-sm text-muted-foreground">
          إنشاء منشور إخباري جديد
        </p>
      </div>
      <Separator />
      <CreateNewPoste />
    </div>
  )
}