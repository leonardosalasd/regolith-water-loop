import type { Metadata } from "next";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "Regolith Water Loop — columna de pretratamiento de agua",
  description:
    "Hardware abierto: una columna de pretratamiento de agua en tres etapas que convierte regolito volcánico y biochar de pirólisis en un filtro por gravedad, construida y probada en banco.",
  alternates: { canonical: "/es/" },
};

export default function Page() {
  return <Landing locale="es" />;
}
