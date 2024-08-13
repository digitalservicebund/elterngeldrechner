import type { Variante } from "@/features/planer/domain/Variante";

export type VerfuegbaresKontingent = Readonly<Record<Variante, number>>;
