import ClientsAdmin from "@/components/global/clientsAdmin";
import callApi from "@/lib/callApi";
import { ResponseApi } from "@/types/response";
import { cookies } from "next/headers";


export const dynamic = "force-dynamic";
export const revalidate = 0;


export default async function ClientsPage() {

    const getReportesHistoricoFechas = async () => {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("token")?.value;
            const responseApi: ResponseApi = await callApi.get(`/api/historico-recipe/reporte-fechas`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Response getReposterHistoricoFechas:", responseApi);

            if (responseApi.status && responseApi.data) {
                return Array.isArray(responseApi.data) ? responseApi.data : [];
            }
            return [];
        } catch (error) {
            console.error("Error fetching getReposterHistoricoFechas:", error);
            return [];
        }
    };

    const data = await getReportesHistoricoFechas();
    return (
        <div >

            <ClientsAdmin
                dataRequests={data}
            // totalRequests={data}
            // totalPagesRequests={data}
            />
        </div>
    );
}
