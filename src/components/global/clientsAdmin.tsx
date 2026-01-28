"use client";
import { Card, CardContent } from "../ui/card";
import ClientTableWrapper from "../wrappers/ClientsTableWrapper";



interface HeroTableClientProps {
//   dataRequests: any[];
//   totalRequests: number;
//   totalPagesRequests: number;
}

export default function ClientsAdmin({
//   dataRequests,
//   totalRequests,
//   totalPagesRequests,
  
}: HeroTableClientProps,) {


  return (
    <>

      {/* Content Section */}
      <div className="mt-4">
        <div className="border-b border-gray-200">

        </div>
        <Card className="w-full rounded-t-none rounded-b-2xl shadow-md bg-white mb-6 border-t-0">
          <CardContent>

              <ClientTableWrapper
                // data={dataRequests}
                // totalPages={totalPagesRequests}
                // totalItems={totalRequests}
              />
             
          </CardContent>
        </Card>
      </div>
    </>
  );
}
