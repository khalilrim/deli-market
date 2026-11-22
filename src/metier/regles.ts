import { refus, succes, type Resultat } from "../modele/resultat";
import type {
  Montants,
  StatutCommande,
  Transition,
  ZoneLivraison
} from "../modele/types";
import type { Parametres } from "./parametres";

/** Additionne des valeurs dans un tableau */
export function sommer<T>(
  items: readonly T[],
  valeur: (item: T) => number
): number {
  let total = 0;

  for (const item of items) {
    total = total + valeur(item);
  }

  return total;
}

/** vérifier la quantité d'un produit */
export function validerQuantite(
  quantite: number,
  p: Parametres
): Resultat<number> {
  if (!Number.isInteger(quantite)) {
    return refus("quantite_invalide");
  }

  if (quantite < p.quantiteMin || quantite > p.quantiteMax) {
    return refus(
      "quantite_hors_limites (" +
      p.quantiteMin + "-" + p.quantiteMax + ")"
    );
  }

  return succes(quantite);
}

/** calculer la remise fidélité */
export function calculerRemiseFidelite(
  sousTotal: number,
  commandesPassees: number,
  p: Parametres
): number {
  if (commandesPassees >= p.commandesPourFidelite) {
    return Math.round(sousTotal * p.tauxRemiseFidelite);
  }

  return 0;
}

/** calculer la réduction de bienvenue */
export function calculerReductionBienvenue(
  sousTotalApresRemise: number,
  commandesPassees: number,
  p: Parametres
): number {
  if (commandesPassees === 0) {
    return Math.min(
      p.reductionBienvenue,
      sousTotalApresRemise
    );
  }

  return 0;
}

/** calculer les frais de livraison */
export function calculerFraisLivraison(
  zone: ZoneLivraison,
  sousTotalApresRemise: number,
  p: Parametres
): number {
  if (sousTotalApresRemise >= p.seuilLivraisonGratuite) {
    return 0;
  }

  if (zone === "centre") {
    return p.fraisLivraison.centre;
  }

  if (zone === "peripherie") {
    return p.fraisLivraison.peripherie;
  }

  return p.fraisLivraison.interieur;
}

/** calculer les frais de paiement */
export function calculerFraisPaiement(
  total: number,
  p: Parametres
): number {
  const frais = Math.round(total * p.tauxFraisPaiement);

  if (frais < p.fraisPaiementMinimum) {
    return p.fraisPaiementMinimum;
  }

  return frais;
}

/** calculer tous les montants d'une commande */
export function calculerMontants(
  sousTotal: number,
  commandesPassees: number,
  zone: ZoneLivraison,
  p: Parametres
): Montants {
  const remiseFidelite = calculerRemiseFidelite(
    sousTotal,
    commandesPassees,
    p
  );

  const apresFidelite = sousTotal - remiseFidelite;

  const reductionBienvenue = calculerReductionBienvenue(
    apresFidelite,
    commandesPassees,
    p
  );

  const sousTotalApresRemise =
    apresFidelite - reductionBienvenue;

  const fraisLivraison = calculerFraisLivraison(
    zone,
    sousTotalApresRemise,
    p
  );

  const total = sousTotalApresRemise + fraisLivraison;

  const fraisPaiement = calculerFraisPaiement(total, p);

  const aPayer = total + fraisPaiement;

  return {
    sousTotal,
    remiseFidelite,
    reductionBienvenue,
    sousTotalApresRemise,
    fraisLivraison,
    total,
    fraisPaiement,
    aPayer
  };
}

/** changer l'état d'une commande */
export function appliquerTransition(
  actuel: StatutCommande,
  transition: Transition
): Resultat<StatutCommande> {
  const message =
    "transition_interdite (" +
    actuel.statut + " -> " + transition.vers + ")";

  if (transition.vers === "expediee") {
    if (actuel.statut === "en_preparation") {
      return succes({
        statut: "expediee",
        transporteur: transition.transporteur
      });
    }

    return refus(message);
  }

  if (transition.vers === "livree") {
    if (actuel.statut === "expediee") {
      return succes({
        statut: "livree",
        jour: transition.jour
      });
    }

    return refus(message);
  }

  if (transition.vers === "annulee") {
    if (actuel.statut === "en_preparation") {
      return succes({
        statut: "annulee",
        motif: transition.motif
      });
    }

    return refus(message);
  }

  return refus(message);
}