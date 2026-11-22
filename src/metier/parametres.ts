import type { ZoneLivraison } from "../modele/types";

/** On définit les valeurs utilisées pour les calculs */
export interface Parametres {
  readonly fraisLivraison: Readonly<Record<ZoneLivraison, number>>;
  readonly seuilLivraisonGratuite: number;
  readonly tauxRemiseFidelite: number;
  readonly commandesPourFidelite: number;
  readonly tauxFraisPaiement: number;
  readonly fraisPaiementMinimum: number;
  readonly quantiteMin: number;
  readonly quantiteMax: number;
  readonly reductionBienvenue: number;
}

/** On met les prix des livraisons et le montant pour la livraison gratuite */
/** On définit aussi les réductions, les frais de paiement et les quantités */
export const PARAMETRES_PAR_DEFAUT: Parametres = {
  fraisLivraison: { centre: 1000, peripherie: 1500, interieur: 5000 },
  seuilLivraisonGratuite: 60000,
  tauxRemiseFidelite: 0.08,
  commandesPourFidelite: 2,
  tauxFraisPaiement: 0.01,
  fraisPaiementMinimum: 100,
  quantiteMin: 1,
  quantiteMax: 10,
  reductionBienvenue: 1000
};