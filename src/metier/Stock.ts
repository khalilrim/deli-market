import type { Produit } from "../modele/types";

export class Stock {
  private produits: Produit[] = [];

  /** On ajoute un produit dans le stock */
  ajouterProduit(produit: Produit): void {
    for (let i = 0; i < this.produits.length; i++) {
      const p = this.produits[i];

      if (p !== undefined && p.id === produit.id) {
        this.produits.splice(i, 1, { ...produit });
        return;
      }
    }

    this.produits.push({ ...produit });
  }

  /** On cherche un produit avec son id */
  trouver(id: string): Produit | undefined {
    for (const produit of this.produits) {
      if (produit.id === id) {
        return { ...produit };
      }
    }

    return undefined;
  }

  /** On regarde combien de produits il reste */
  disponible(id: string): number {
    const produit = this.trouver(id);

    if (produit === undefined) {
      return 0;
    }

    return produit.stock;
  }

  /** On enlève les produits achetés du stock */
  retirer(id: string, quantite: number): boolean {
    for (let i = 0; i < this.produits.length; i++) {
      const produit = this.produits[i];

      if (produit !== undefined && produit.id === id) {
        if (produit.stock < quantite) {
          return false;
        }

        this.produits[i] = {
          ...produit,
          stock: produit.stock - quantite
        };

        return true;
      }
    }

    return false;
  }

  /** On remet les produits dans le stock */
  remettre(id: string, quantite: number): boolean {
    for (let i = 0; i < this.produits.length; i++) {
      const produit = this.produits[i];

      if (produit !== undefined && produit.id === id) {
        this.produits[i] = {
          ...produit,
          stock: produit.stock + quantite
        };

        return true;
      }
    }

    return false;
  }
}