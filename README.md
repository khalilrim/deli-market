Deli Market

1. Présentation du projet

Deli Market est une boutique en ligne fictive qui vend des produits en pagne et des produits locaux.

Les clients peuvent choisir leurs produits, passer une commande et payer par mobile money. La boutique propose des livraisons à Abidjan et à l’intérieur du pays.

Ce projet a été réalisé en TypeScript dans le cadre du module de conception logicielle.

2. Comment lancer le projet

Il faut avoir Node.js installé sur l’ordinateur.

Dans le terminal, on utilise ces commandes :

npm install

Pour installer les éléments nécessaires au projet.

npm run build

Pour compiler le code TypeScript.

npm start

Pour lancer le programme et voir les exemples de commandes.

npm test

Pour vérifier que le programme fonctionne correctement.

3. Organisation des fichiers

Le dossier src contient les fichiers du programme.

* modele : contient les types et les informations des produits, clients et commandes.
* metier : contient le panier, le stock et les règles de calcul.
* donnees : sert à enregistrer les commandes.
* interface : sert à afficher les informations et les notifications.
* doublures : contient les éléments utilisés pour les tests.
* tests : contient les tests du programme.
* index.ts : sert à lancer les exemples de commandes.

4. Les règles de la boutique

R1 : Quantités

Un client peut ajouter entre 1 et 10 exemplaires d’un produit dans son panier.

R2 : Stock

Une commande est refusée si la quantité demandée dépasse le stock disponible. Le stock diminue seulement quand la commande est validée.

R3 : Remise fidélité

Un client qui a déjà passé au moins 2 commandes reçoit une réduction de 8 %.

R4 : Livraison

Les frais dépendent de la zone :

* Centre : 1 000 FCFA
* Périphérie : 1 500 FCFA
* Intérieur du pays : 5 000 FCFA

La livraison est gratuite à partir de 60 000 FCFA après les réductions.

R5 : Paiement

Les frais de paiement mobile money représentent 1 % du total, avec un minimum de 100 FCFA.

R6 : Statut des commandes

Une commande passe par plusieurs étapes :

En préparation → Expédiée → Livrée

Une commande peut être annulée seulement lorsqu’elle est encore en préparation. Dans ce cas, les produits sont remis en stock.

R9 : Réduction de bienvenue

Un client qui n’a jamais passé de commande reçoit une réduction de 1 000 FCFA.

Cette réduction ne peut pas dépasser le montant de sa commande.

5. Les valeurs modifiées

Nous avons changé trois valeurs par rapport au sujet :

* Livraison en périphérie : de 2 000 à 1 500 FCFA.
* Livraison gratuite : de 50 000 à 60 000 FCFA.
* Remise fidélité : de 5 % à 8 %.

Ces valeurs se trouvent dans parametres.ts.

6. Comment les montants sont calculés

Le programme calcule d’abord le prix des produits selon leurs quantités.

Ensuite, il applique les réductions si le client y a droit.

Après les réductions, il ajoute les frais de livraison si elle n’est pas gratuite.

Enfin, il calcule les frais de paiement mobile money pour obtenir le montant final à payer.

7. Exemples de calculs

Exemple 1 : Client avec une commande passée

Pour un panier de 45 000 FCFA livré en périphérie :

* Produits : 45 000 FCFA
* Livraison : 1 500 FCFA
* Total : 46 500 FCFA
* Frais de paiement : 465 FCFA
* À payer : 46 965 FCFA

Exemple 2 : Nouveau client

Pour un panier de 45 000 FCFA livré en périphérie :

* Produits : 45 000 FCFA
* Réduction de bienvenue : 1 000 FCFA
* Livraison : 1 500 FCFA
* Total : 45 500 FCFA
* Frais de paiement : 455 FCFA
* À payer : 45 955 FCFA

Exemple 3 : Client fidèle

Pour un panier de 64 000 FCFA livré en périphérie :

* Produits : 64 000 FCFA
* Remise de 8 % : 5 120 FCFA
* Montant après remise : 58 880 FCFA
* Livraison : 1 500 FCFA
* Total : 60 380 FCFA
* Frais de paiement : 604 FCFA
* À payer : 60 984 FCFA

8. Les tests

Nous avons réalisé 45 tests pour vérifier le fonctionnement du programme.

Les tests vérifient notamment :

* Les quantités dans le panier.
* La disponibilité des produits en stock.
* Les remises et les réductions.
* Les frais de livraison et de paiement.
* La validation et le refus des commandes.
* Les changements de statut.
* L’annulation et la remise en stock.
* Les notifications et l’affichage.

Résultat de notre dernière vérification :

45 tests réussis et 0 échec.

9. Ce qui n’a pas été réalisé

Les règles R7 et R8 sont prévues pour une prochaine version du projet.

10. Conclusion

Ce projet nous a permis de travailler avec TypeScript et de mieux comprendre comment organiser un programme en plusieurs fichiers.

Nous avons aussi appris à gérer les commandes, les stocks, les calculs et à utiliser des tests pour vérifier notre travail.