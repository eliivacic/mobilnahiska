"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Home, Building2, LandPlot, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhotoUploader } from "@/components/listings/PhotoUploader";
import { LAND_TYPE_LABELS, type LandType } from "@/types/land";
import { submitListingSubmission, type SubmitListingState } from "@/lib/supabase/listing-submissions";
import { formatPrice } from "@/lib/format";

type SubmissionType = "mobilna" | "modularna" | "zemljisce";

const TYPE_OPTIONS: { value: SubmissionType; label: string; icon: typeof Home }[] = [
  { value: "mobilna", label: "Mobilna hiška", icon: Home },
  { value: "modularna", label: "Modularna hiša", icon: Building2 },
  { value: "zemljisce", label: "Zemljišče", icon: LandPlot },
];

const COUNTRY_OPTIONS = ["Slovenija", "Hrvaška", "Italija", "Avstrija", "ostalo"];

interface FieldValues {
  title: string;
  description: string;
  price: string;
  location: string;
  country: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  condition: "" | "nova" | "rabljena";
  manufacturer: string;
  year: string;
  area: string;
  length: string;
  width: string;
  bedrooms: string;
  bathrooms: string;
  capacity: string;
  deliveryAvailable: boolean;
  landType: LandType | "";
  utilitiesAvailable: boolean;
}

const EMPTY_FIELDS: FieldValues = {
  title: "",
  description: "",
  price: "",
  location: "",
  country: "Slovenija",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  condition: "",
  manufacturer: "",
  year: "",
  area: "",
  length: "",
  width: "",
  bedrooms: "",
  bathrooms: "",
  capacity: "",
  deliveryAvailable: false,
  landType: "",
  utilitiesAvailable: false,
};

const initialState: SubmitListingState = {};

export function OddajOglasForm({
  userId,
  defaultContactName,
  defaultContactEmail,
}: {
  userId: string;
  defaultContactName: string;
  defaultContactEmail: string;
}) {
  const [state, formAction, pending] = useActionState(submitListingSubmission, initialState);
  const [type, setType] = useState<SubmissionType | null>(null);
  const [phase, setPhase] = useState<"form" | "preview">("form");
  const [fields, setFields] = useState<FieldValues>({
    ...EMPTY_FIELDS,
    contactName: defaultContactName,
    contactEmail: defaultContactEmail,
  });
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [clientError, setClientError] = useState<string | null>(null);

  function update<K extends keyof FieldValues>(key: K, value: FieldValues[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!type) return "Izberite vrsto nepremičnine.";
    if (fields.title.trim().length < 5) return "Naslov mora imeti vsaj 5 znakov.";
    if (fields.description.trim().length < 20) return "Opis mora imeti vsaj 20 znakov.";
    if (!fields.price || Number(fields.price) <= 0) return "Vnesite veljavno ceno.";
    if (!fields.location.trim()) return "Vnesite lokacijo.";
    if (!fields.contactName.trim()) return "Vnesite kontaktno ime.";
    if (!fields.contactPhone.trim()) return "Vnesite kontaktno telefonsko številko.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.contactEmail)) return "Vnesite veljaven kontaktni e-poštni naslov.";
    if (photoUrls.length < 1) return "Dodajte vsaj eno fotografijo.";

    if (type === "mobilna" || type === "modularna") {
      if (!fields.condition) return "Izberite stanje hiške.";
      if (!fields.manufacturer.trim()) return "Vnesite proizvajalca.";
      if (!fields.year || Number(fields.year) < 1950) return "Vnesite veljavno leto izdelave.";
      if (!fields.area || Number(fields.area) <= 0) return "Vnesite veljavno površino.";
      if (!fields.length || Number(fields.length) <= 0 || !fields.width || Number(fields.width) <= 0) {
        return "Vnesite veljavne dimenzije.";
      }
      if (fields.bedrooms === "" || Number(fields.bedrooms) < 0) return "Vnesite število spalnic.";
      if (fields.bathrooms === "" || Number(fields.bathrooms) < 0) return "Vnesite število kopalnic.";
      if (!fields.capacity || Number(fields.capacity) <= 0) return "Vnesite kapaciteto.";
    } else if (type === "zemljisce") {
      if (!fields.landType) return "Izberite tip zemljišča.";
      if (!fields.area || Number(fields.area) <= 0) return "Vnesite veljavno površino.";
    }

    return null;
  }

  function handlePreview() {
    const error = validate();
    setClientError(error);
    if (!error) setPhase("preview");
  }

  if (state.success) {
    return (
      <div className="rounded-[14px] border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/40">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
          Oglas je bil oddan
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Vaš oglas je bil uspešno oddan in ima status{" "}
          <span className="font-semibold text-foreground">V pregledu</span>. Objavljen bo, ko ga potrdi
          administrator portala.
        </p>
        <Button asChild className="mt-6 bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/moj-racun/oglasi">Pojdi na Moji oglasi</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      <input type="hidden" name="type" value={type ?? ""} />
      <input type="hidden" name="photoUrls" value={JSON.stringify(photoUrls)} />

      <div className={phase === "form" ? "space-y-8" : "hidden"}>
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
            1. Vrsta nepremičnine
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  aria-pressed={active}
                  className={`flex flex-col items-center gap-2 rounded-[12px] border p-5 text-sm font-medium transition-colors ${
                    active
                      ? "border-brand bg-secondary/30 text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/40"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {type && (
          <>
            <section className="space-y-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
                2. Osnovni podatki
              </h2>
              <div className="space-y-1.5">
                <Label htmlFor="title">Naslov oglasa</Label>
                <Input
                  id="title"
                  name="title"
                  value={fields.title}
                  onChange={(event) => update("title", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Opis</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={fields.description}
                  onChange={(event) => update("description", event.target.value)}
                  required
                  className="w-full rounded-[10px] border border-border bg-background p-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Cena (€)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    step={100}
                    value={fields.price}
                    onChange={(event) => update("price", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Lokacija (kraj)</Label>
                  <Input
                    id="location"
                    name="location"
                    value={fields.location}
                    onChange={(event) => update("location", event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Država</Label>
                <Select value={fields.country} onValueChange={(value) => update("country", value)}>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="country" value={fields.country} />
              </div>
            </section>

            {(type === "mobilna" || type === "modularna") && (
              <section className="space-y-4">
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
                  3. Podrobnosti hiške
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="condition">Stanje</Label>
                    <Select
                      value={fields.condition}
                      onValueChange={(value) => update("condition", value as FieldValues["condition"])}
                    >
                      <SelectTrigger id="condition" className="w-full">
                        <SelectValue placeholder="Izberite stanje" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nova">Nova</SelectItem>
                        <SelectItem value="rabljena">Rabljena</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="condition" value={fields.condition} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="manufacturer">Proizvajalec</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={fields.manufacturer}
                      onChange={(event) => update("manufacturer", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="year">Leto izdelave</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min={1950}
                      max={new Date().getFullYear() + 1}
                      value={fields.year}
                      onChange={(event) => update("year", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="area">Površina (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      min={0}
                      value={fields.area}
                      onChange={(event) => update("area", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="length">Dolžina (m)</Label>
                    <Input
                      id="length"
                      name="length"
                      type="number"
                      min={0}
                      step={0.1}
                      value={fields.length}
                      onChange={(event) => update("length", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="width">Širina (m)</Label>
                    <Input
                      id="width"
                      name="width"
                      type="number"
                      min={0}
                      step={0.1}
                      value={fields.width}
                      onChange={(event) => update("width", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bedrooms">Spalnice</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min={0}
                      value={fields.bedrooms}
                      onChange={(event) => update("bedrooms", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bathrooms">Kopalnice</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min={0}
                      value={fields.bathrooms}
                      onChange={(event) => update("bathrooms", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="capacity">Kapaciteta (oseb)</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min={1}
                      value={fields.capacity}
                      onChange={(event) => update("capacity", event.target.value)}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 text-sm text-foreground">
                  <Checkbox
                    name="deliveryAvailable"
                    checked={fields.deliveryAvailable}
                    onCheckedChange={(checked) => update("deliveryAvailable", checked === true)}
                  />
                  Možna je dostava
                </label>
              </section>
            )}

            {type === "zemljisce" && (
              <section className="space-y-4">
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
                  3. Podrobnosti zemljišča
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="landType">Tip zemljišča</Label>
                    <Select
                      value={fields.landType}
                      onValueChange={(value) => update("landType", value as LandType)}
                    >
                      <SelectTrigger id="landType" className="w-full">
                        <SelectValue placeholder="Izberite tip" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(LAND_TYPE_LABELS) as [LandType, string][]).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" name="landType" value={fields.landType} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="land-area">Površina (m²)</Label>
                    <Input
                      id="land-area"
                      name="area"
                      type="number"
                      min={0}
                      value={fields.area}
                      onChange={(event) => update("area", event.target.value)}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 text-sm text-foreground">
                  <Checkbox
                    name="utilitiesAvailable"
                    checked={fields.utilitiesAvailable}
                    onCheckedChange={(checked) => update("utilitiesAvailable", checked === true)}
                  />
                  Priključki na parceli so na voljo
                </label>
              </section>
            )}

            <section className="space-y-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
                4. Kontaktni podatki
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Ime in priimek</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={fields.contactName}
                    onChange={(event) => update("contactName", event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone">Telefon</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={fields.contactPhone}
                    onChange={(event) => update("contactPhone", event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">E-poštni naslov</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={fields.contactEmail}
                  onChange={(event) => update("contactEmail", event.target.value)}
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
                5. Fotografije
              </h2>
              <div className="mt-3">
                <PhotoUploader userId={userId} photoUrls={photoUrls} onChange={setPhotoUrls} />
              </div>
            </section>

            {clientError && (
              <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {clientError}
              </p>
            )}

            <Button
              type="button"
              onClick={handlePreview}
              className="w-full bg-primary text-primary-foreground hover:bg-brand-hover sm:w-auto"
            >
              Predogled oglasa
            </Button>
          </>
        )}
      </div>

      {phase === "preview" && type && (
        <section className="space-y-5 rounded-[14px] border border-border bg-card p-6">
          <h2 className="font-heading text-xl font-light tracking-[-0.01em] text-foreground">
            Predogled oglasa
          </h2>

          {photoUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photoUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="aspect-square rounded-[8px] object-cover" />
              ))}
            </div>
          )}

          <div>
            <p className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">{fields.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {fields.location}, {fields.country}
            </p>
            <p className="mt-2 font-heading text-xl font-light tracking-[-0.01em] text-foreground">
              {fields.price ? formatPrice(Number(fields.price)) : ""}
            </p>
          </div>

          <p className="whitespace-pre-line text-sm text-foreground/90">{fields.description}</p>

          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {(type === "mobilna" || type === "modularna") && (
              <>
                <PreviewSpec label="Stanje" value={fields.condition === "nova" ? "Nova" : "Rabljena"} />
                <PreviewSpec label="Proizvajalec" value={fields.manufacturer} />
                <PreviewSpec label="Leto" value={fields.year} />
                <PreviewSpec label="Površina" value={`${fields.area} m²`} />
                <PreviewSpec label="Dimenzije" value={`${fields.length} × ${fields.width} m`} />
                <PreviewSpec label="Spalnice" value={fields.bedrooms} />
                <PreviewSpec label="Kopalnice" value={fields.bathrooms} />
                <PreviewSpec label="Kapaciteta" value={`${fields.capacity} oseb`} />
                <PreviewSpec label="Dostava" value={fields.deliveryAvailable ? "Da" : "Ne"} />
              </>
            )}
            {type === "zemljisce" && (
              <>
                <PreviewSpec label="Tip zemljišča" value={fields.landType ? LAND_TYPE_LABELS[fields.landType] : ""} />
                <PreviewSpec label="Površina" value={`${fields.area} m²`} />
                <PreviewSpec label="Priključki" value={fields.utilitiesAvailable ? "Da" : "Ne"} />
              </>
            )}
            <PreviewSpec label="Kontakt" value={fields.contactName} />
            <PreviewSpec label="Telefon" value={fields.contactPhone} />
            <PreviewSpec label="E-pošta" value={fields.contactEmail} />
          </dl>

          {state.error && (
            <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => setPhase("form")} disabled={pending}>
              Uredi
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-primary text-primary-foreground hover:bg-brand-hover"
            >
              {pending ? "Oddajanje …" : "Oddaj oglas"}
            </Button>
          </div>
        </section>
      )}
    </form>
  );
}

function PreviewSpec({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
