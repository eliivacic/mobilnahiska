import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/dashboard/AdminPlaceholder";

export const metadata: Metadata = { title: "Promocije | Admin | mobilnahiska.si" };

export default function AdminPromocijePage() {
  return (
    <AdminPlaceholder
      title="Promocije in izpostavitve"
      description="Pregled TOP oglasov, izpostavitev na naslovnici in promocijskih obdobij (npr. brezplačni paket za prve partnerje)."
      needs="Za promocijska obdobja z datumom začetka/konca in dodelitvijo ponudniku je potrebna tabela promocij, vezana na resnične oglase in ponudnike v bazi."
    />
  );
}
