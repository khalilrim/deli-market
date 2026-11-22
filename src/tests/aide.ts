import { DepotCommandesFactice } from "../doublures/DepotCommandesFactice";
import { NotificateurEspion } from "../doublures/NotificateurEspion";
import { Panier } from "../metier/Panier";
import { ServiceCommande } from "../metier/ServiceCommande";
import { Stock } from "../metier/Stock";
import type { Client, Produit } from "../modele/types";

export const PAGNE: Produit = { id: "P1", nom: "Pagne wax", prix: 15000, stock: 20 };
export const NAPPE: Produit = { id: "P2", nom: "Nappe en pagne", prix: 12000, stock: 5 };
export const SAVON: Produit = { id: "P3", nom: "Savon noir", prix: 2000, stock: 50 };

/** les produits utilisées pour les tests */
export const PRODUIT_TEST_ID = "PX";

export const NOUVEAU: Client = { nom: "Nouveau", commandesPassees: 0 };
export const DEBUTANT: Client = { nom: "Debutant", commandesPassees: 1 };
export const FIDELE: Client = { nom: "Fidele", commandesPassees: 2 };

/** on prépare les éléments nécessaires pour les tests */
export function creerBanc() {
  const depot = new DepotCommandesFactice();
  const notificateur = new NotificateurEspion();
  const stock = new Stock();
  for (const p of [PAGNE, NAPPE, SAVON]) stock.ajouterProduit(p);
  stock.ajouterProduit({ id: PRODUIT_TEST_ID, nom: "Produit test", prix: 0, stock: 10 });
  const service = new ServiceCommande(depot, stock, notificateur);
  return { depot, notificateur, stock, service };
}

/** on crée un panier avec un produit et une quantité */
export function panierDe(produit: Produit, quantite: number): Panier {
  const panier = new Panier();
  panier.ajouter(produit, quantite);
  return panier;
}
