-- Compétences (3 groupes) — à exécuter dans Supabase → SQL Editor
-- Structure : table skills (id uuid, data jsonb)
-- Inclut : After Effects, Make, Postman (logo à jour)

-- Option 1 : tout remplacer (recommandé si vous voulez les données à jour)
delete from public.skills;

insert into public.skills (data) values
(
  '{
    "title": "Développement",
    "description": "Langages, frameworks et stacks pour concevoir des applications web et mobile.",
    "skills": [
      {"name": "HTML/CSS", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"},
      {"name": "JavaScript", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"},
      {"name": "TypeScript", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"},
      {"name": "Angular", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg"},
      {"name": "Flutter", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"},
      {"name": "React Js", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"},
      {"name": "Java/JEE", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"},
      {"name": "Spring Boot", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"}
    ]
  }'::jsonb
),
(
  '{
    "title": "Design & Audio-visuel",
    "description": "Maquettes UI/UX, identité visuelle et production de contenus visuels.",
    "skills": [
      {"name": "Figma", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"},
      {"name": "Photoshop", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg"},
      {"name": "Illustrator", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg"},
      {"name": "Premiere Pro", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg"},
      {"name": "After Effects", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg"},
      {"name": "CapCut", "icon": "https://images.seeklogo.com/logo-png/43/1/capcut-logo-png_seeklogo-437025.png"},
      {"name": "Canva", "icon": "https://www.vectorlogo.zone/logos/canva/canva-icon.svg"}
    ]
  }'::jsonb
),
(
  '{
    "title": "Outils & Méthodes",
    "description": "Versioning, tests API, cloud, déploiement, automatisation et méthodes agiles.",
    "skills": [
      {"name": "Git", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"},
      {"name": "GitHub", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"},
      {"name": "IA Tools", "icon": "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg"},
      {"name": "Supabase", "icon": "https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg"},
      {"name": "Firebase", "icon": "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg"},
      {"name": "Postman", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg"},
      {"name": "Make", "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/png/make.png"},
      {"name": "Vercel", "icon": "https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg"},
      {"name": "Cursor", "icon": "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/png/cursor.png"},
      {"name": "Agile", "icon": "https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg"},
      {"name": "Trello", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg"}
    ]
  }'::jsonb
);

-- Vérification
select
  id,
  data->>'title' as titre,
  jsonb_array_length(data->'skills') as nb_technos
from public.skills
order by created_at;

-- ---------------------------------------------------------------------------
-- Option 2 : mettre à jour sans tout supprimer (si les 3 lignes existent déjà)
-- Décommentez et adaptez si besoin :
-- ---------------------------------------------------------------------------
/*
update public.skills set data = '...json développement...'::jsonb
where data->>'title' = 'Développement';

update public.skills set data = '...json design...'::jsonb
where data->>'title' = 'Design & Audio-visuel';

update public.skills set data = '...json outils...'::jsonb
where data->>'title' = 'Outils & Méthodes';
*/
