"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Country } from "@/types/listing";
import { LAND_TYPE_LABELS, type LandType } from "@/types/land";

type SearchTab = "mobilna" | "modularna" | "zemljisce";

const TABS: { value: SearchTab; label: string }[] = [
  { value: "mobilna", label: "Mobilne hiške" },
  { value: "modularna", label: "Modularne hiše" },
  { value: "zemljisce", label: "Zemljišča" },
];

const COUNTRY_OPTIONS: Country[] = ["Slovenija", "Hrvaška", "Italija", "Avstrija", "ostalo"];
const LAND_TYPE_OPTIONS = Object.entries(LAND_TYPE_LABELS) as [LandType, string][];

export function SearchBar() {
  const router = useRouter();
  const [tab, setTab] = useState<SearchTab>("mobilna");
  const [country, setCountry] = useState("vse");
  const [condition, setCondition] = useState("vse");
  const [landType, setLandType] = useState<LandType | "vse">("vse");
  const [priceMax, setPriceMax] = useState("");
  const [areaMin, setAreaMin] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (country !== "vse") params.set("country", country);
    // Guard against negative values (e.g. pasted in) so a bad search never
    // silently returns zero results.
    if (priceMax && Number(priceMax) >= 0) params.set("priceMax", priceMax);
    if (areaMin && Number(areaMin) >= 0) params.set("areaMin", areaMin);

    if (tab === "zemljisce") {
      // Zazidljiva zemljišča still need a real data source — this only
      // forwards the chosen filters to /zemljisca as query params so they
      // are ready to wire up once that backend exists.
      if (landType !== "vse") params.set("landType", landType);
      router.push(`/zemljisca${params.toString() ? `?${params.toString()}` : ""}`);
      return;
    }

    params.set("type", tab);
    if (condition !== "vse") params.set("condition", condition);
    router.push(`/oglasi?${params.toString()}`);
  }

  return (
    <div className="w-full">
      <div className="flex gap-1.5 overflow-x-auto pb-2.5">
        {TABS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTab(option.value)}
            className={`whitespace-nowrap rounded-[8px] px-3.5 py-2 text-sm font-semibold transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] ${
              tab === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 rounded-[14px] border border-border bg-card p-1.5 shadow-lift sm:flex-row sm:items-stretch sm:gap-0.5"
      >
        <div className="flex-1 rounded-[10px] px-3.5 py-2.5 transition-colors focus-within:bg-muted hover:bg-muted/60">
          <label htmlFor="search-country" className="block text-[11px] font-medium text-muted-foreground">
            Lokacija
          </label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger
              id="search-country"
              className="h-auto w-full border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0 [&>svg]:opacity-60"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vse">Vse lokacije</SelectItem>
              {COUNTRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 rounded-[10px] px-3.5 py-2.5 transition-colors focus-within:bg-muted hover:bg-muted/60">
          <label htmlFor="search-price" className="block text-[11px] font-medium text-muted-foreground">
            Cena do (€)
          </label>
          <Input
            id="search-price"
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            placeholder="brez omejitve"
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            className="h-auto border-none bg-transparent p-0 text-sm font-semibold shadow-none placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-0"
          />
        </div>

        <div className="flex-1 rounded-[10px] px-3.5 py-2.5 transition-colors focus-within:bg-muted hover:bg-muted/60">
          <label htmlFor="search-area" className="block text-[11px] font-medium text-muted-foreground">
            Površina od (m²)
          </label>
          <Input
            id="search-area"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="brez omejitve"
            value={areaMin}
            onChange={(event) => setAreaMin(event.target.value)}
            className="h-auto border-none bg-transparent p-0 text-sm font-semibold shadow-none placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-0"
          />
        </div>

        {tab === "zemljisce" ? (
          <div className="flex-1 rounded-[10px] px-3.5 py-2.5 transition-colors focus-within:bg-muted hover:bg-muted/60">
            <label htmlFor="search-land-type" className="block text-[11px] font-medium text-muted-foreground">
              Tip zemljišča
            </label>
            <Select value={landType} onValueChange={(value) => setLandType(value as LandType | "vse")}>
              <SelectTrigger
                id="search-land-type"
                className="h-auto w-full border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0 [&>svg]:opacity-60"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vse">Vsi tipi</SelectItem>
                {LAND_TYPE_OPTIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex-1 rounded-[10px] px-3.5 py-2.5 transition-colors focus-within:bg-muted hover:bg-muted/60">
            <label htmlFor="search-condition" className="block text-[11px] font-medium text-muted-foreground">
              Stanje
            </label>
            <Select value={condition} onValueChange={setCondition}>
              <SelectTrigger
                id="search-condition"
                className="h-auto w-full border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0 [&>svg]:opacity-60"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vse">Vse</SelectItem>
                <SelectItem value="nova">Nova</SelectItem>
                <SelectItem value="rabljena">Rabljena</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="sm:flex sm:items-center">
          <Button
            type="submit"
            className="h-12 w-full gap-2 rounded-[10px] bg-primary text-primary-foreground hover:bg-brand-hover sm:h-full sm:w-auto sm:px-6"
          >
            <Search className="h-4 w-4" />
            Prikaži oglase
          </Button>
        </div>
      </form>
    </div>
  );
}
