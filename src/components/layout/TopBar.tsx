import Link from "next/link";

export function TopBar() {
  return (
    <div className="bg-secondary px-4 py-2 text-center text-[13px] font-medium text-brand">
      Ta spletna stran je naprodaj —{" "}
      <Link href="mailto:info@veloria.si" className="font-bold underline underline-offset-2">
        pišite na info@veloria.si
      </Link>
    </div>
  );
}
