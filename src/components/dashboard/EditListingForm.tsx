"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoUploader } from "@/components/listings/PhotoUploader";
import { updateListingSubmission, type SubmitListingState } from "@/lib/supabase/listing-submissions";

const initialState: SubmitListingState = {};

export interface EditListingDefaults {
  title: string;
  description: string;
  price: string;
  location: string;
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
  utilitiesAvailable: boolean;
  photoUrls: string[];
}

export function EditListingForm({
  submissionId,
  userId,
  isHouseType,
  defaults,
}: {
  submissionId: string;
  userId: string;
  isHouseType: boolean;
  defaults: EditListingDefaults;
}) {
  const action = updateListingSubmission.bind(null, submissionId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const [fields, setFields] = useState(defaults);
  const [photoUrls, setPhotoUrls] = useState<string[]>(defaults.photoUrls);
  const set = <K extends keyof EditListingDefaults>(key: K, value: EditListingDefaults[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <input type="hidden" name="photoUrls" value={JSON.stringify(photoUrls)} />

      <div className="space-y-1.5">
        <Label>Fotografije</Label>
        <PhotoUploader userId={userId} photoUrls={photoUrls} onChange={setPhotoUrls} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Naslov</Label>
        <Input id="title" name="title" value={fields.title} onChange={(e) => set("title", e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Opis</Label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={fields.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full rounded-[10px] border border-border bg-background p-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Cena (€)</Label>
          <Input id="price" name="price" type="number" min="0" value={fields.price} onChange={(e) => set("price", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Lokacija</Label>
          <Input id="location" name="location" value={fields.location} onChange={(e) => set("location", e.target.value)} required />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Kontakt</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="contactName">Ime</Label>
          <Input id="contactName" name="contactName" value={fields.contactName} onChange={(e) => set("contactName", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Telefon</Label>
          <Input id="contactPhone" name="contactPhone" value={fields.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactEmail">E-pošta</Label>
          <Input id="contactEmail" name="contactEmail" type="email" value={fields.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} required />
        </div>
      </div>

      {isHouseType ? (
        <>
          <div className="border-t border-border pt-4">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Podrobnosti hiške</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="condition">Stanje</Label>
              <Select value={fields.condition} onValueChange={(v) => set("condition", v as "nova" | "rabljena")}>
                <SelectTrigger id="condition">
                  <SelectValue placeholder="Izberite" />
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
              <Input id="manufacturer" name="manufacturer" value={fields.manufacturer} onChange={(e) => set("manufacturer", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="year">Leto</Label>
              <Input id="year" name="year" type="number" value={fields.year} onChange={(e) => set("year", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="area">Površina (m²)</Label>
              <Input id="area" name="area" type="number" value={fields.area} onChange={(e) => set("area", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Kapaciteta</Label>
              <Input id="capacity" name="capacity" type="number" value={fields.capacity} onChange={(e) => set("capacity", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="length">Dolžina (m)</Label>
              <Input id="length" name="length" type="number" value={fields.length} onChange={(e) => set("length", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="width">Širina (m)</Label>
              <Input id="width" name="width" type="number" value={fields.width} onChange={(e) => set("width", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">Spalnice</Label>
              <Input id="bedrooms" name="bedrooms" type="number" min="0" value={fields.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bathrooms">Kopalnice</Label>
              <Input id="bathrooms" name="bathrooms" type="number" min="0" value={fields.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} required />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              name="deliveryAvailable"
              checked={fields.deliveryAvailable}
              onCheckedChange={(checked) => set("deliveryAvailable", checked === true)}
            />
            Dostava možna
          </label>
        </>
      ) : (
        <>
          <div className="border-t border-border pt-4">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Podrobnosti zemljišča</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="area">Površina (m²)</Label>
            <Input id="area" name="area" type="number" value={fields.area} onChange={(e) => set("area", e.target.value)} required />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Checkbox
              name="utilitiesAvailable"
              checked={fields.utilitiesAvailable}
              onCheckedChange={(checked) => set("utilitiesAvailable", checked === true)}
            />
            Komunalni priključki na voljo
          </label>
        </>
      )}

      {state.error && (
        <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-[10px] bg-secondary/40 px-3 py-2 text-sm text-primary">
          Spremembe shranjene. Oglas je bil poslan v ponoven pregled.
        </p>
      )}

      <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : "Shrani spremembe"}
      </Button>
    </form>
  );
}
