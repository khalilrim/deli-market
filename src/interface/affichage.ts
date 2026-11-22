import type { Commande, StatutCommande } from "../modele/types";

/** On affiche les montants en FCFA */
export function formaterMontant(montant: number): string {
  const nombre = String(montant);
  const resultat = nombre.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return resultat + " FCFA";
}

/** On affiche l'état actuel de la commande */
export function decrireStatut(statut: StatutCommande): string {
  if (statut.statut === "en_preparation") {
    return "en préparation";
  }

  if (statut.statut === "expediee") {
    return "expédiée par " + statut.transporteur;
  }

  if (statut.statut === "livree") {
    return "livrée le " + statut.jour;
  }

  if (statut.statut === "annulee") {
    return "annulée (" + statut.motif + ")";
  }

  return "";
}

/** On affiche les informations d'une commande */
export function formaterCommande(c: Commande): string {
  const lignes: string[] = [];

  lignes.push(
    c.id + " | " + c.client + " | " + c.jour +
    " | " + decrireStatut(c.statut)
  );

  for (const ligne of c.lignes) {
    lignes.push(
      "  " + ligne.quantite + " x " + ligne.nom +
      " (" + formaterMontant(ligne.prixUnitaire) + ")"
    );
  }

  lignes.push(
    "  livraison " + c.livraison.zone +
    " : " + formaterMontant(c.livraison.frais)
  );

  lignes.push(
    "  total " + formaterMontant(c.total) +
    " + frais " + c.operateur +
    " " + formaterMontant(c.fraisPaiement)
  );

  lignes.push(
    "  à payer : " + formaterMontant(c.aPayer)
  );

  return lignes.join("\n");
}