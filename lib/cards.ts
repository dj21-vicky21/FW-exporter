import ServiceRequesReport from "@/app/custom_report/components/serviceRequesReport/serviceRequesReport"
import { SimpleCard } from "./types"

export const allCards: SimpleCard[] = [
    {
        id: "1",
        name: "Service Request Report",
        description: "Get the list of fields and default details for the SR in an XLSX file.",
        component: ServiceRequesReport,
        details: {
          tags: ["Service Request", "SR", "SR fields"],
          fileType: "XLSX"
        }
      }
]