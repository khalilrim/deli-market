import type { DepotCommandes } from "../metier/contrats";
import type { Commande } from "../modele/types";

export class DepotCommandesMemoire implements DepotCommandes {
  private commandes: Commande[] = [];

  /** On ajoute une nouvelle commande */
  ajouter(commande: Commande): void {
    this.commandes.push(commande);
  }

  /** On récupère toutes les commandes */
  tout(): readonly Commande[] {
    const liste: Commande[] = [];

    for (const commande of this.commandes) {
      liste.push(commande);
    }

    return liste;
  }

  /** On récupère les commandes d'un client */
  parClient(nomClient: string): readonly Commande[] {
    const resultat: Commande[] = [];

    for (const commande of this.commandes) {
      if (commande.client === nomClient) {
        resultat.push(commande);
      }
    }

    return resultat;
  }

  /** On cherche une commande avec son id */
  trouver(id: string): Commande | undefined {
    for (const commande of this.commandes) {
      if (commande.id === id) {
        return commande;
      }
    }

    return undefined;
  }

  /** On modifie une commande déjà enregistrée */
  mettreAJour(commande: Commande): void {
    for (let i = 0; i < this.commandes.length; i++) {
      const ancienneCommande = this.commandes[i];

      if (
        ancienneCommande !== undefined &&
        ancienneCommande.id === commande.id
      ) {
        this.commandes.splice(i, 1, commande);
        return;
      }
    }
  }
}