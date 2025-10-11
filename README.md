# Cadavre Exquis
## Projet créatif du Département d’histoire de l’art, de cinéma et des médias audiovisuels de l'Univesité de Montréal
### [cadavrexquis.ca](https://cadavrexquis.ca/)

Porteur de projet : André Habib  
Design graphique : Dominique Fortier  
Développement web : Myriam Bizier
Collaboration: Louis Pelletier, Corina MacDonald

## Deploying to Netlify

This site requires [Netlify Next Runtime v5](https://docs.netlify.com/frameworks/next-js/overview/) for full functionality. That version is now being gradually rolled out to all Netlify accounts. 

After deploying via the button below, please visit the **Site Overview** page for your new site to check whether it is already using the v5 runtime. If not, you'll be prompted to opt-in to to v5.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-platform-starter)

## Developing Locally

1. Clone this repository, then run `npm install` in its root directory.

2. For the starter to have full functionality locally (e.g. edge functions, blob store), please ensure you have an up-to-date version of Netlify CLI. Run:

```
npm install netlify-cli@latest -g
```

3. Link your local repository to the deployed Netlify site. This will ensure you're using the same runtime version for both local development and your deployed site.

```
netlify link
```

4. Then, run the Next.js development server via Netlify CLI:

```
netlify dev
```

If your browser doesn't navigate to the site automatically, visit [localhost:8888](http://localhost:8888).

5. Linting, to detect potential bugs before deployment
```
npm run lint
```

## Deploy
GIT push to main on Github repo. It triggers a Netlify deployment.


## Actions sur DB Drupal depuis migration
- Adaptation du node type Article pour les documents (renommé Document)
- Ajout de deux nodes Documents tests

## Note sur un bogue d'hydratation et le composant TempProtectLayout
- Le composant de protection temporaire par mot de passe est laissé volontairement même en prod
- On y a retiré les fonctionnalités de prompt pour verification de mot de passe
- Il inclue un useEffect qui prévient un bogue d'hydratation React.
- Le bogue demanderait un refactor de tous les appels à localStorage, date(now) et typeof window !== 'undefined')
- Semble-t-il que l'appel d'un premier useEffect avant tout rendu html, comme le fait TempProtectLayout dans sa plus simple expression, prévient le bogue d'hydratation React.

Ref : https://nextjs.org/docs/messages/react-hydration-error
