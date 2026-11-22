/** Les zones où on peut livrer */
export type ZoneLivraison = "centre" | "peripherie" | "interieur";

/** Les moyens de paiement acceptés */
export type Operateur = "Orange Money" | "MTN MoMo" | "Moov Money";

/** Les différents états d'une commande */
export type StatutCommande =
  | { readonly statut: "en_preparation" }
  | { readonly statut: "expediee"; readonly transporteur: string }
  | { readonly statut: "livree"; readonly jour: string }
  | { readonly statut: "annulee"; readonly motif: string };

/** On indique vers quel état la commande doit passer */
export type Transition =
  | { readonly vers: "expediee"; readonly transporteur: string }
  | { readonly vers: "livree"; readonly jour: string }
  | { readonly vers: "annulee"; readonly motif: string };

/** Les informations d'un produit */
export interface Produit {
  readonly id: string;
  readonly nom: string;
  readonly prix: number;
  readonly stock: number;
}

/** Les informations d'un client */
export interface Client {
  readonly nom: string;
  readonly commandesPassees: number;
}

/** Les produits et leurs quantités dans une commande */
export interface LigneCommande {
  readonly produitId: string;
  readonly nom: string;
  readonly prixUnitaire: number;
  readonly quantite: number;
}

/** Les informations de livraison */
export interface Livraison {
  readonly zone: ZoneLivraison;
  readonly frais: number;
}

/** On garde toutes les informations d'une commande */
export interface Commande {
  readonly id: string;
  readonly client: string;
  readonly lignes: readonly LigneCommande[];
  readonly statut: StatutCommande;
  readonly livraison: Livraison;
  readonly operateur: Operateur;
  readonly total: number;
  readonly fraisPaiement: number;
  readonly aPayer: number;
  readonly jour: string;
}

/** On garde le détail des calculs de la commande */
export interface Montants {
  readonly sousTotal: number;
  readonly remiseFidelite: number;
  readonly reductionBienvenue: number;
  readonly sousTotalApresRemise: number;
  readonly fraisLivraison: number;
  readonly total: number;
  readonly fraisPaiement: number;
  readonly aPayer: number;
}