import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Panier } from "../metier/Panier";
import { Stock } from "../metier/Stock";
import { NAPPE, PAGNE, SAVON } from "./aide";

// On vérifie le fonctionnement du panier
describe("Panier (R1)", () => {
  it("un nouveau panier est vide, sous-total 0", () => {
    const panier = new Panier();
    assert.ok(panier.estVide());
    assert.equal(panier.sousTotal(), 0);
  });

  it("sous-total = somme des prix × quantités", () => {
    const panier = new Panier();
    panier.ajouter(PAGNE, 2); // 30 000
    panier.ajouter(SAVON, 3); // 6 000
    assert.equal(panier.sousTotal(), 36000);
  });

  it("ajouter deux fois le même produit cumule la quantité", () => {
    const panier = new Panier();
    panier.ajouter(PAGNE, 2);
    panier.ajouter(PAGNE, 3);
    assert.equal(panier.lignes()[0]?.quantite, 5);
  });

  // On vérifie les limites de quantité
  it("quantité 10 acceptée, 11 refusée", () => {
    assert.ok(new Panier().ajouter(PAGNE, 10).ok);
    assert.ok(!new Panier().ajouter(PAGNE, 11).ok);
  });

  it("le cumul ne peut pas dépasser 10 et le panier reste inchangé", () => {
    const panier = new Panier();
    panier.ajouter(PAGNE, 6);
    const r = panier.ajouter(PAGNE, 5);
    assert.ok(!r.ok);
    assert.equal(panier.lignes()[0]?.quantite, 6);
  });

  // On vérifie qu'on peut retirer un produit
  it("retirer supprime la ligne ; produit absent renvoie false", () => {
    const panier = new Panier();
    panier.ajouter(PAGNE, 1);
    assert.equal(panier.retirer(PAGNE.id), true);
    assert.equal(panier.retirer(PAGNE.id), false);
    assert.ok(panier.estVide());
  });

  it("lignes() renvoie une copie : la modifier ne change pas le panier", () => {
    const panier = new Panier();
    panier.ajouter(PAGNE, 1);
    (panier.lignes() as unknown[]).pop();
    assert.equal(panier.lignes().length, 1);
  });
});

// On vérifie le fonctionnement du stock
describe("Stock (R2)", () => {
  const creer = () => {
    const stock = new Stock();
    stock.ajouterProduit(NAPPE); // 5 en stock
    return stock;
  };

  it("retirer la quantité exacte donne 0", () => {
    const stock = creer();
    assert.equal(stock.retirer(NAPPE.id, 5), true);
    assert.equal(stock.disponible(NAPPE.id), 0);
  });

  /** On vérifie qu'on ne peut pas retirer plus que le stock */
  it("retirer plus que le stock : false et rien ne change", () => {
    const stock = creer();
    assert.equal(stock.retirer(NAPPE.id, 6), false);
    assert.equal(stock.disponible(NAPPE.id), 5);
  });

  /** On remet les produits dans le stock */
  it("remettre augmente le stock", () => {
    const stock = creer();
    stock.retirer(NAPPE.id, 2);
    stock.remettre(NAPPE.id, 2);
    assert.equal(stock.disponible(NAPPE.id), 5);
  });

  /** On vérifie le cas d'un produit inconnu */
  it("produit inconnu : disponible 0, retirer et remettre renvoient false", () => {
    const stock = creer();
    assert.equal(stock.disponible("ZZ"), 0);
    assert.equal(stock.retirer("ZZ", 1), false);
    assert.equal(stock.remettre("ZZ", 1), false);
    assert.equal(stock.trouver("ZZ"), undefined);
  });
});