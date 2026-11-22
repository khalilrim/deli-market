import { refus, succes, type Resultat } from "../modele/resultat";
import type { LigneCommande, Produit } from "../modele/types";
import { PARAMETRES_PAR_DEFAUT, type Parametres } from "./parametres";
import { validerQuantite } from "./regles";

export class Panier {
  private lignesPanier: LigneCommande[] = [];

  constructor(
    private readonly parametres: Parametres = PARAMETRES_PAR_DEFAUT
  ) {}

  /** On ajoute un produit au panier */
  ajouter(produit: Produit, quantite: number): Resultat<null> {
    const verification = validerQuantite(quantite, this.parametres);

    if (!verification.ok) {
      return refus(verification.motif);
    }

    for (const ligne of this.lignesPanier) {
      if (ligne.produitId === produit.id) {
        const nouvelleQuantite = ligne.quantite + quantite;

        const resultat = validerQuantite(
          nouvelleQuantite,
          this.parametres
        );

        if (!resultat.ok) {
          return refus(resultat.motif + " pour " + produit.nom);
        }

        const position = this.lignesPanier.indexOf(ligne);

        this.lignesPanier.splice(position, 1, {
          produitId: produit.id,
          nom: produit.nom,
          prixUnitaire: produit.prix,
          quantite: nouvelleQuantite
        });

        return succes(null);
      }
    }

    this.lignesPanier.push({
      produitId: produit.id,
      nom: produit.nom,
      prixUnitaire: produit.prix,
      quantite: quantite
    });

    return succes(null);
  }

  /** On retire un produit du panier */
  retirer(produitId: string): boolean {
    for (const ligne of this.lignesPanier) {
      if (ligne.produitId === produitId) {
        const position = this.lignesPanier.indexOf(ligne);
        this.lignesPanier.splice(position, 1);
        return true;
      }
    }

    return false;
  }

  /** On récupère les produits du panier */
  lignes(): readonly LigneCommande[] {
    const copie: LigneCommande[] = [];

    for (const ligne of this.lignesPanier) {
      copie.push({ ...ligne });
    }

    return copie;
  }

  /** On vérifie si le panier est vide */
  estVide(): boolean {
    return this.lignesPanier.length === 0;
  }

  /** On calcule le prix total des produits */
  sousTotal(): number {
    let total = 0;

    for (const ligne of this.lignesPanier) {
      total = total + ligne.prixUnitaire * ligne.quantite;
    }

    return total;
  }
}