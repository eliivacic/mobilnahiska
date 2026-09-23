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

export function SearchBar() {
  const router = useRouter();
  const [type, setType] = useState("vse");
  const [condition, setCondition] = useState("vse");
  const [priceMax, setPriceMax] = useState("");
  const [areaMin, setAreaMin] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (type !== "vse") params.set("type", type);
    if (condition !== "vse") params.set("condition", condition);
    if (priceMax) params.set("priceMax", priceMax);
    if (areaMin) params.set("areaMin", areaMin);
    router.push(`/oglasi${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-1 rounded-[8px] border border-border bg-card p-1.5 shadow-lift sm:flex-row sm:items-stretch sm:gap-0.5"
    >
      <div className="flex-1 rounded-[6px] px-3.5 py-2.5 transition-colors focus-within:bg-secondary/30 hover:bg-secondary/20">
        <label htmlFor="search-type" className="block text-[11px] font-medium text-muted-foreground">
          Tip hiške
        </label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger
            id="search-type"
            className="h-auto w-full border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0 [&>svg]:opacity-60"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vse">Vse</SelectItem>
            <SelectItem value="mobilna">Mobilna hiška</SelectItem>
            <SelectItem value="modularna">Modularna hiša</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 rounded-[6px] px-3.5 py-2.5 transition-colors focus-within:bg-secondary/30 hover:bg-secondary/20">
        <label
          htmlFor="search-condition"
          className="block text-[11px] font-medium text-muted-foreground"
        >
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

      <div className="flex-1 rounded-[6px] px-3.5 py-2.5 transition-colors focus-within:bg-secondary/30 hover:bg-secondary/20">
        <label htmlFor="search-price" className="block text-[11px] font-medium text-muted-foreground">
          Cena do (€)
        </label>
        <Input
          id="search-price"
          type="number"
          inputMode="numeric"
          placeholder="brez omejitve"
          value={priceMax}
          onChange={(event) => setPriceMax(event.target.value)}
          className="h-auto border-none bg-transparent p-0 text-sm font-semibold shadow-none placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-0"
        />
      </div>

      <div className="flex-1 rounded-[6px] px-3.5 py-2.5 transition-colors focus-within:bg-secondary/30 hover:bg-secondary/20">
        <label htmlFor="search-area" className="block text-[11px] font-medium text-muted-foreground">
          Površina od (m²)
        </label>
        <Input
          id="search-area"
          type="number"
          inputMode="numeric"
          placeholder="brez omejitve"
          value={areaMin}
          onChange={(event) => setAreaMin(event.target.value)}
          className="h-auto border-none bg-transparent p-0 text-sm font-semibold shadow-none placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-0"
        />
      </div>

      <div className="sm:flex sm:items-center">
        <Button
          type="submit"
          className="h-12 w-full gap-2 rounded-[6px] bg-brand text-brand-foreground hover:bg-brand-hover sm:h-full sm:w-auto sm:px-6"
        >
          <Search className="h-4 w-4" />
          Prikaži hiške
        </Button>
      </div>
    </form>
  );
}
