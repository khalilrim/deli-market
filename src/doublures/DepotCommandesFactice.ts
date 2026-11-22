import type { DepotCommandes } from "../metier/contrats";
import type { Commande } from "../modele/types";

export class DepotCommandesFactice implements DepotCommandes {
  readonly contenu: Commande[] = [];

  /** On ajoute une commande pour les tests */
  ajouter(commande: Commande): void {
    this.contenu.push(commande);
  }

  /** On récupère toutes les commandes */
  tout(): readonly Commande[] {
    return this.contenu;
  }

  /** On cherche les commandes d'un client */
  parClient(nomClient: string): readonly Commande[] {
    return this.contenu.filter((c) => c.client === nomClient);
  }

  /** On cherche une commande avec son id */
  trouver(id: string): Commande | undefined {
    return this.contenu.find((c) => c.id === id);
  }

  /** On modifie une commande */
  mettreAJour(commande: Commande): void {
    const index = this.contenu.findIndex((c) => c.id === commande.id);

    if (index >= 0) {
      this.contenu[index] = commande;
    }
  }
}