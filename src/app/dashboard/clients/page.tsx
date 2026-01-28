import ClientsAdmin from "@/components/global/clientsAdmin";
import callApi from "@/lib/callApi";
import { ResponseApi } from "@/types/response";
import { cookies } from "next/headers";


export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function RequestsPage() {
//   const requests = await getRequestByUser();
  return (
    <div className="p-6 ">
      

      <ClientsAdmin
    
      />
    </div>
  );
}
