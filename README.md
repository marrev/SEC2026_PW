# SEC2026_PW
Création de site web dans le cadre du cours de PW 

# Jvent — Projet Programmation Web

Application web de gestion d'évènements :
- Frontend : React + TypeScript (Vite)
- Backend : Node.js + Express
- Base de données : PostgreSQL
- Authentification : JWT
  
### Fonctionnalités
- Création / modification / suppression d’évènements (par le créateur uniquement)
- Évènements publics / privés
- Inscription / désinscription
- Limite maximale de participants respectée côté serveur
- Affichage des participants
- Filtres : tous / mes évènements / inscrit
- Thème clair / sombre
- Modales de consultation détaillée

---
  
## Prérequis

- Node.js (>= 18 recommandé)
- npm
- PostgreSQL (>= 13 recommandé)
- pgAdmin (optionnel) ou psql

## Structure du projet
- `event-frontend/` : application React
- `backend/` : API Express
- `db/` : scripts SQL ou backup

---

## 1) Installation

### Backend
Depuis la racine
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../event-frontend
npm install
```

### Base de données
- Créer la base databasepw
Object --> Create --> Database --> Renseigner databasepw pour le nom
- Restaurer la base de données directement depuis pgAdmin4
Tool --> Restore --> Sélectionner le fichier backupBDD.sql ou .bakcup
### ou
A l'aide de psql depuis le terminal
#### Se connecter à la base
```bash
psql -U postgres
```
Renseigner son mot de passe.

#### Création de la base
```sql
CREATE DATABASE 
```

#### Restaurer la base de données
```bash
psql -U postgres -d databasepw --set=client_encoding=UTF8 -f db/backupBDD.sql
```
ou
```bash
pg_restore -U postgres -d databasepw -v db/backupBDD.backup
```

Note encodage : la base est en UTF8. En cas de souci d'accents, forcer client_encoding=UTF8 lors des imports texte.

### Adapter la connexion de la base de données
Dans le fichier backend/db.js, modifier les champs pour correspondre à votre configuration (le champ password à changer, le reste devrait être correct).

## 2) Lancement

### Backend
Depuis le dossier backend
```bash
node .\src\server.js
```

### Frontend
Depuis le dossier event-frontend
```bash
npm run dev
```

## 3) Accès au site web
http://localhost:5173/

## 4) Informations utiles
Il y a 4 utilisateurs de démo, voici leurs authentifiants:
  - admin / admin
  - bob / mdp_bob
  - alice / mdp_alice
  - charlie / mdp_charlie
