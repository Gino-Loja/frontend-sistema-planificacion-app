import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FormSkeleton = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Título field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Descripción field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Date field skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-[240px] bg-gray-200 rounded animate-pulse" />
          </div>

          {/* AsyncSelect fields skeletons */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}

          {/* Button skeleton */}
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormSkeleton;