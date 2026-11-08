# Snuke

Le jeu du serpent sur un plateau de 24 × 24 cases, avec six modes : classique, sans bords, labyrinthe, mue, chrono 60 secondes et vergers. Mange les fruits, grandis, et ne te mords pas la queue.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Flèches** ou **ZQSD**, ou **glisser à la souris** : tourner.
- **P** ou **Échap** : pause ; une flèche pour reprendre.
- **Espace** ou **Entrée** : rejouer après une partie.

## Règles communes

- Chaque fruit vaut **10 points** et allonge le serpent d'une case.
- Le serpent accélère tous les 6 fruits, jusqu'à une vitesse maximale.
- Tous les **7 fruits**, une **étoile** apparaît : elle vaut **50 points** mais disparaît au bout de 5 secondes (elle clignote avant de partir).
- Se mordre la queue fait perdre (sauf en chrono).

## Les modes

- **Classique** : les bords du plateau tuent.
- **Sans bords** : en sortant d'un côté, on ressort de l'autre.
- **Labyrinthe** : quatre plateaux murés (couloirs, cage, colonnes, zigzag) ; on passe au suivant tous les 10 fruits.
- **Mue** : tous les 5 fruits, la queue se change en pierre (des obstacles qui restent), le serpent repart avec 3 cases et gagne 25 points.
- **Chrono 60 s** : vitesse fixe, rien ne tue. Se mordre coupe la queue à l'endroit de la morsure. On fait le plus de points possible avant la fin du temps.
- **Vergers** : trois fruits sur le plateau, parmi dix espèces. La vitesse du serpent devient celle du **dernier fruit mangé**, et les fruits rapides rapportent plus :

| Fruit | Vitesse | Points | Allonge de |
|---|---|---|---|
| Piment | très rapide | 50 | 1 |
| Fraise | rapide | 35 | 1 |
| Citron | rapide | 25 | 2 |
| Orange | assez rapide | 22 | 1 |
| Cerise | assez rapide | 18 | 2 |
| Pomme | normale | 12 | 1 |
| Kiwi | lente | 12 | 2 |
| Raisin | lente | 9 | 1 |
| Pastèque | très lente | 7 | 4 |
| Myrtille | très lente | 5 | 1 |

Une jauge en haut du plateau montre la vitesse actuelle.

## Records et statistiques

Un record par mode, le nombre de parties, le total de fruits mangés et la plus grande longueur atteinte s'affichent en haut du jeu.

## Données et synchronisation

Records et statistiques sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée. Au premier lancement, le plugin reprend ce que tu avais déjà dans NeoDex.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Snuke → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
