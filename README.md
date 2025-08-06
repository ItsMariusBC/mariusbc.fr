# Portfolio Marius - Site Personnel avec Panel Admin

Site portfolio personnel avec système d'administration pour gérer le contenu dynamiquement.

## 🚀 Fonctionnalités

- **Portfolio personnel** avec animations modernes
- **Panel d'administration** sécurisé avec Better Auth
- **Gestion dynamique** du bouton de contact et des icônes du dock
- **Base de données PostgreSQL** avec Prisma ORM
- **Docker** pour un déploiement facile

## 🛠️ Technologies

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Better Auth, Prisma ORM
- **Base de données**: PostgreSQL
- **Déploiement**: Docker, Docker Compose

## 📦 Installation

### Développement Local

1. **Cloner le projet**
```bash
git clone <repository-url>
cd marius-portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer la base de données**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Démarrer PostgreSQL avec Docker Compose (recommandé)
npm run docker:dev

# OU démarrer PostgreSQL manuellement
# docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=marius_portfolio -p 5432:5432 -d postgres:15

# Générer le client Prisma
npm run db:generate

# Appliquer les migrations
npm run db:migrate

# Peupler la base de données
npm run db:seed
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

### Déploiement avec Docker

1. **Construire et démarrer les services**
```bash
# Construction et démarrage
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

2. **Arrêter les services**
```bash
docker-compose down
```

## 🛠️ Développement avec Docker Compose

Pour le développement, utilisez le fichier `docker-compose.dev.yml` qui inclut :

### Services de Développement
- **postgres-dev**: Base de données PostgreSQL (port 5432)
- **pgAdmin**: Interface web pour gérer la DB (port 5050)

### Commandes de Développement
```bash
# Démarrer uniquement la base de données
npm run docker:dev

# Voir les logs de la DB
npm run docker:dev:logs

# Arrêter la DB
npm run docker:dev:down

# Accéder à pgAdmin
# URL: http://localhost:5050
# Email: admin@marius-portfolio.com
# Password: admin123
```

### Configuration de pgAdmin
1. Ouvrir http://localhost:5050
2. Se connecter avec les identifiants ci-dessus
3. Ajouter un serveur :
   - **Name**: Marius Portfolio Dev
   - **Host**: postgres-dev
   - **Port**: 5432
   - **Username**: postgres
   - **Password**: password

## 🔑 Accès Admin

### Première utilisation
1. **Créer le premier compte admin**: `http://localhost:3000/admin/signup`
2. **Se connecter**: `http://localhost:3000/admin`

### URLs d'administration
- **Signup**: `http://localhost:3000/admin/signup` (pour créer le premier admin)
- **Login**: `http://localhost:3000/admin` (pour se connecter)
- **Dashboard**: `http://localhost:3000/admin/dashboard` (panel d'administration)

⚠️ **Note**: Le premier utilisateur créé via signup deviendra automatiquement admin.

## 📋 Utilisation

### Page d'Accueil
- Affiche le portfolio personnel avec animations
- Bouton "Me contacter" configurable
- Dock d'icônes sociales avec tooltips

### Panel Admin (`/admin`)
- **Configuration du site**: Modifier l'URL du bouton de contact
- **Gestion des icônes**: Ajouter, modifier, supprimer les icônes du dock
- **Activation/Désactivation**: Contrôler la visibilité des icônes

### Gestion des Icônes
- **Icônes supportées**: GitHub, LinkedIn, Mail, Phone, FileText, MessageSquare
- **Configuration**: Nom, icône, URL, tooltip, ordre d'affichage
- **Types d'URL**: `mailto:`, `tel:`, `https://` supportés

## 🗄️ Base de Données

### Schéma Prisma
- **users**: Utilisateurs administrateurs
- **site_config**: Configuration générale du site
- **dock_icons**: Icônes du dock social

### Commandes Utiles
```bash
# Générer le client Prisma
npm run db:generate

# Créer une migration
npm run db:migrate

# Appliquer les migrations en production
npx prisma migrate deploy

# Peupler la base de données
npm run db:seed

# Interface graphique de la DB
npm run db:studio
```

## 🐳 Docker

### Services
- **postgres**: Base de données PostgreSQL
- **web**: Application React/Node.js

### Volumes
- **postgres_data**: Données persistantes de PostgreSQL

### Ports
- **3000**: Application web
- **5432**: Base de données PostgreSQL

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Construction pour production
npm run preview      # Aperçu de la build de production
npm run lint         # Vérification du code

# Base de données
npm run db:generate  # Générer le client Prisma
npm run db:push      # Pousser le schéma vers la DB
npm run db:migrate   # Créer et appliquer une migration
npm run db:seed      # Peupler la base de données
npm run db:studio    # Interface graphique de la DB

# Docker
npm run docker:up       # Démarrer les containers (production)
npm run docker:down     # Arrêter les containers (production)
npm run docker:logs     # Voir les logs (production)

# Docker Development
npm run docker:dev      # Démarrer la DB de développement
npm run docker:dev:down # Arrêter la DB de développement
npm run docker:dev:logs # Voir les logs de développement
```

## 🎨 Personnalisation

### Ajouter de Nouvelles Icônes
1. Ajouter l'icône Lucide React dans `IconMap`
2. L'ajouter dans `iconOptions` du dashboard admin
3. Utiliser le panel admin pour créer l'icône

### Modifier le Thème
- Modifier les couleurs dans `tailwind.config.js`
- Adapter les styles dans les composants

## 🔒 Sécurité

- Authentification via Better Auth
- Sessions sécurisées avec cookies
- Validation des données côté serveur
- Protection CSRF intégrée

## 📝 Variables d'Environnement

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/marius_portfolio"
NODE_ENV="development"
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.