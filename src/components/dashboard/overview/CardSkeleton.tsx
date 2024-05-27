'use client';

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

export default function CardSkeleton({ count }: { count?: number }) {
  return (
    <>
      {Array(count || 3)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="flex flex-col justify-between">
          <CardHeader className="p-2">
            <div className="relative  rounded-md object-cover">
              <Skeleton className="w-full max-w-full h-40" />
            </div>
            <CardDescription className="font-aljazira font-semibold text-lg">
              <div className="w-full">
              <Skeleton className="w-full h-8" />
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter className="grid gap-6">
            <div className="flex justify-start items-center gap-x-3">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
            </div>
          </CardFooter>
        </Card>
        )
      )

        }
    </>
  );
}
