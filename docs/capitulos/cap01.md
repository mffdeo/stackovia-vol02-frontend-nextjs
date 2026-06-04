---
title: "Capítulo 01 — Da intranet estática ao app: onboarding do V02"
status: Preview
volume: 2
capitulo: 1
maturidade: "Revisado v1.0"
---

> ⚠️ **Conteúdo em construção.** Este capítulo faz parte da Stackovia Learning Series,
> desenvolvida ativamente em 2026. Para acompanhar o progresso ou contribuir,
> acesse o [repositório hub](https://github.com/mffdeo/stackovia-learning) no GitHub.


# Capítulo 01 — Da intranet estática ao app: onboarding do V02

## Abertura narrativa na Stackovia

Três semanas depois de fazer o deploy do IntraStack básico, o Mestre Py te chama para uma conversa rápida.

Ele abre o repositório no celular. A home carrega. As páginas existem. O link do GitHub está no README. Ele navega com o polegar, para em silêncio por alguns segundos, e vira o celular na sua direção.

"Funciona. Mas eu não consigo usar."

Você olha para a tela. O IntraStack básico está lá, responsivo, sem erros de console, exatamente como você entregou. Você não entende o que está errado.

O Mestre Py explica: ele queria filtrar a lista de integrantes por área. Não tem filtro. Queria salvar o link da página da equipe no favorito para abrir direto. O link abre a home — a navegação interna é feita com `<a>` que recarrega a página inteira. Queria que um colega adicionasse a própria entrada na lista sem alterar o HTML. Não tem como. "É HTML estático. Funciona como HTML estático."

Ele não está criticando você. Ele está te mostrando o teto do que HTML/CSS/JS básico consegue entregar — e onde um app React/Next.js começa a fazer sentido.

"O próximo card é esse: transformar o IntraStack em uma versão de verdade. Componentes, rotas, TypeScript, qualidade. Você começa hoje."

## Card da sprint

```text
[Card da Sprint]
Sprint:    Início do V02 — CARD-0002
Cargo:     Júnior de frontend na Stackovia
Tarefa:    Entender por que o IntraStack básico não é suficiente
           e preparar o projeto stackovia-intrastack-app.
Definição
de pronto: Projeto Next.js + TypeScript + Tailwind + shadcn/ui
           criado; primeira rota / funcionando; .env.local no
           .gitignore; primeiro commit semântico feito.
```

Repare no que esse card declara como pronto: não é "aprendi React" nem "entendi o framework". É um projeto criado, funcionando e versionado. Você sabe quando terminou porque tem algo verificável para mostrar.

Uma observação sobre o tamanho da sprint: o V02 tem 14 capítulos, e cada um corresponde a um card — não a uma semana de calendário. Seu ritmo de avanço depende do tempo que você tem, do nível de familiaridade com o material e de quantas vezes você precisará reler e praticar. Não trate esses cards como corrida.

## Problema de negócio

O IntraStack básico foi aprovado como prova de conceito. A liderança técnica da Stackovia reconhece o progresso — você aprendeu a estruturar HTML semântico, versionar código, publicar em GitHub Pages e escrever um README honesto. Isso não é pouco.

Mas o portal cresceu além do que HTML estático consegue manter. A lista de integrantes é hard-coded em três arquivos diferentes. Qualquer mudança no card visual exige editar cada arquivo. Não há como filtrar. Não há como navegar sem recarregar a página. Não há type safety no código.

O próximo card tem objetivo claro: construir uma versão profissional do IntraStack com as ferramentas que um time de frontend usa de verdade — e fazer isso de forma que o código seja verificável, tipado e extensível.

## O que será construído

Ao longo do Volume 2, você vai construir o **IntraStack App**: o portal interno da Stackovia reescrito como app React/Next.js profissional.

O repositório se chama `stackovia-intrastack-app`. Ao final do volume, ele vai conter:

- componentes React reutilizáveis (`TeamCard`, `TeamList`, `Header`);
- rotas estruturadas com App Router do Next.js;
- TypeScript com `strict: true` e zero `any` no caminho principal;
- UI consistente com Tailwind CSS + shadcn/ui;
- dados mockados via API Route Next.js;
- formulário de contato com React Hook Form + Zod;
- checklist de acessibilidade (axe-DevTools, ARIA, foco de teclado);
- relatório Lighthouse antes e depois das otimizações;
- suite mínima de testes com Vitest + Playwright;
- CORS configurado e CSP header básico;
- ESLint + Prettier + `npm run check` verde;
- `CHANGELOG.md`, tag de release e post LinkedIn honesto.

O que o IntraStack App **não** vai ter neste volume:

- autenticação real (JWT, sessão, refresh token) — isso é V03/V04;
- backend Python com banco de dados real — isso é V03;
- Docker, CI/CD, GitHub Actions — isso é V04/V06;
- SSR/SSG profundo, streaming ou cache avançado — isso é V05;
- TanStack Query ou SWR — esse trade-off fica para o V04;
- deploy em cloud, domínio próprio, alta disponibilidade — isso é V06;
- IA, RAG, agentes — isso é a Temporada 2.

Cada vez que um desses temas aparecer em algum capítulo do V02, vai aparecer como ponte ("isso vem depois"), nunca como aula prática agora.

## Cena/tensão de abertura

Você abre o repositório do IntraStack básico com a intenção de adicionar uma segunda página de conteúdo — uma seção de "links úteis" que a equipe pediu.

O plano parece simples: copiar o `index.html`, mudar o conteúdo, ajustar os links de navegação nos dois arquivos. Você faz isso. Funciona. Depois alguém pede para mudar a cor do header. Você abre os dois arquivos e edita nos dois. Depois alguém pede uma terceira página. Você copia de novo.

Quando chega a quinta mudança no visual, você percebe: está editando quatro arquivos para alterar um único detalhe. E qualquer erro de digitação em um deles quebra a consistência sem aviso. Não tem como o TypeScript te avisar. Não tem `import` que falhe em tempo de compilação. Você só descobre quando abre o arquivo errado no browser.

O Mestre Py não precisou dizer nada. Você sentiu o teto.

## Exemplo antes do conceito

Imagine que você quer adicionar uma segunda página ao IntraStack básico. Aqui está o que precisa acontecer:

**IntraStack básico — adicionar página:**

```text
1. Copiar index.html → sobre.html
2. Editar o conteúdo de sobre.html (ok)
3. Atualizar o link "Sobre" em index.html para apontar para sobre.html
4. Atualizar o link "Sobre" em sobre.html para apontar para... si mesmo?
5. Criar uma terceira página: repetir do passo 1
6. Mudar o header em todas as páginas: editar cada arquivo separadamente
7. Mudar a cor primária: editar o CSS em cada arquivo (ou criar um arquivo CSS separado que pode ficar fora de sincronia)
```

Cada página nova multiplica o trabalho de manutenção. Não há componente. Não há rota gerenciada. Não há tipo que garanta que o dado passado entre partes do código é o que você espera.

Agora o mesmo objetivo em um app Next.js:

**IntraStack App — adicionar página:**

```text
1. Criar src/app/sobre/page.tsx
2. Pronto. O Next.js cria a rota /sobre automaticamente.
3. O Header já existe como componente — atualizar em um lugar.
4. A cor primária está no tailwind.config.ts — alterar em um lugar.
```

A diferença não é mágica. É estrutura. É a diferença entre copiar HTML e compor componentes.

## Conceito central: site estático vs app React/Next.js

Um **site estático** é um conjunto de arquivos HTML, CSS e JavaScript independentes. Cada página é um arquivo. Cada mudança é manual. Cada dado compartilhado entre páginas precisa ser duplicado ou sincronizado à mão. É o lugar certo para começar — e o lugar errado para crescer.

Um **app React/Next.js** é construído em cima de três pilares:

- **Componentes**: unidades de interface reutilizáveis. Você define o `Header` uma vez e usa em qualquer página.
- **Rotas**: o App Router do Next.js mapeia pastas em rotas. Criar `src/app/equipe/page.tsx` cria automaticamente a rota `/equipe`.
- **Build pipeline**: antes de servir o app, o Next.js compila TypeScript, verifica tipos, otimiza imagens, aplica tree-shaking e gera os arquivos estáticos ou server-side conforme a configuração.

Isso não é mais poder de graça. Mais ferramentas = mais poder + mais responsabilidade de manutenção. Você vai precisar entender o que cada parte faz, por que falha e quando simplificar.

Esse capítulo não ensina React. Ele prepara o projeto e o ambiente para que os próximos 13 capítulos possam ensinar.

## Estrutura do projeto

O comparativo abaixo é o mapa do que você vai construir:

```text
IntraStack básico (V01)      IntraStack App (V02)
──────────────────────       ──────────────────────
index.html               →   src/app/page.tsx
sobre.html               →   src/app/sobre/page.tsx
contato.html             →   src/app/contato/page.tsx
styles.css               →   tailwind.config.ts
app.js                   →   src/components/
                             src/types/
                             src/lib/
data/equipe.json         →   data/equipe.json
                             src/app/api/equipe/route.ts
README.md                →   README.md
CHANGELOG.md             →   CHANGELOG.md
docs/                    →   docs/
```

No V01, cada arquivo era uma página. No V02, cada arquivo é um módulo com responsabilidade definida. A pasta `src/app/` define as rotas. A pasta `src/components/` armazena os blocos reutilizáveis. A pasta `src/types/` centraliza os tipos TypeScript.

Você não vai criar tudo isso agora. Neste capítulo, você cria a estrutura base e a primeira rota. O restante cresce ao longo dos próximos capítulos — sempre guiado por um problema concreto.

## Implementação guiada

### Passo 1 — Criar o projeto

O `create-next-app` é o scaffolding oficial do Next.js. Ele cria o projeto com a configuração recomendada:

```bash
npx create-next-app@latest stackovia-intrastack-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir
```

O que cada flag faz:

- `--typescript`: configura TypeScript com `tsconfig.json`.
- `--tailwind`: instala Tailwind CSS e cria `tailwind.config.ts`.
- `--eslint`: configura ESLint com as regras do Next.js.
- `--app`: usa o App Router (não o Pages Router legado).
- `--src-dir`: coloca o código em `src/` em vez da raiz.

Quando o instalador perguntar sobre o alias de importação (`@/*`), aceite o padrão (`@/*`). As perguntas do instalador mudam entre versões do Next.js — leia cada uma antes de responder.

Após a instalação, entre na pasta e suba o servidor de desenvolvimento:

```bash
cd stackovia-intrastack-app
npm run dev
```

Abra `http://localhost:3000`. Você deve ver a página inicial padrão do Next.js. Isso confirma que o projeto foi criado corretamente.

### Passo 2 — Instalar shadcn/ui

O shadcn/ui não é uma biblioteca instalada como dependência comum — ele copia os componentes diretamente para o seu projeto, o que te dá controle total sobre o código. Isso é diferente de `npm install` em uma biblioteca fechada.

```bash
npx shadcn@latest init
```

O instalador vai perguntar sobre o estilo base, cor primária e outros detalhes de configuração. Aceite os padrões por enquanto — você vai ajustar os tokens de cor no C06 quando a UI tiver inconsistências visuais reais para resolver.

O comando cria a pasta `src/components/ui/` e atualiza `tailwind.config.ts` e `globals.css` com as variáveis CSS do shadcn/ui.

### Passo 3 — Configurar variáveis de ambiente

Variáveis de ambiente são dados que mudam entre ambientes (desenvolvimento, staging, produção) e que não devem entrar no código versionado. O Next.js tem suporte nativo para isso via arquivo `.env.local`.

Crie o arquivo `.env.example` com um comentário de uso:

```bash
# .env.example
# Copie este arquivo para .env.local e preencha os valores.
# Nunca versione .env.local — ele contém valores reais de ambiente.

# NEXT_PUBLIC_APP_NAME=IntraStack App
```

Verifique que `.env.local` já está no `.gitignore` que o `create-next-app` criou. Se não estiver, adicione:

```
.env.local
```

Isso não é opcional. Um `.env.local` versionado acidentalmente é o tipo de erro que aparece em post-mortem de incidente de segurança — e que o Mestre Py vai apontar em code review antes do seu primeiro commit.

### Passo 4 — Criar a primeira rota

Abra `src/app/page.tsx`. Substitua o conteúdo padrão gerado pelo `create-next-app` por algo que identifica o projeto:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">IntraStack App</h1>
      <p className="mt-2 text-muted-foreground">Em construção — V02.</p>
    </main>
  );
}
```

Não é a home final. É o marcador de que o projeto existe, tem identidade e está sendo construído com intenção. Cada capítulo vai adicionar uma camada.

### Passo 4-b — Entender o `layout.tsx`

Antes de fazer o commit, abra `src/app/layout.tsx`. Esse arquivo foi gerado automaticamente pelo `create-next-app` e merece atenção: ele é o **wrapper raiz de todas as rotas** do IntraStack App.

O conteúdo gerado é parecido com este:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'stackovia-intrastack-app',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

Três coisas para notar agora:

- **`children`** é onde cada `page.tsx` será renderizado. O layout envolve todas as páginas — é aqui que o `Header` vai entrar quando você chegar no C04.
- **`metadata`** define o título e a descrição da aba do browser. Altere para algo que identifique o projeto: `title: 'IntraStack App'`.
- **`lang="en"`** deve ser trocado para `lang="pt-BR"` se o conteúdo do portal for em português.

Faça essas duas alterações agora — são as únicas que fazem sentido no C01. O `Header` e o `Footer` entram no C04, quando as rotas estiverem estruturadas.

### Passo 5 — Primeiro commit semântico

O commit inaugural do `stackovia-intrastack-app` deve ser rastreável e descritivo:

```bash
git add .
git commit -m "feat(setup): initialize intrastack-app with Next.js, TypeScript, Tailwind and shadcn/ui"
```

Commits semânticos seguem o padrão `tipo(escopo): mensagem`. O `feat` indica que é uma funcionalidade nova. O `(setup)` é o escopo. A mensagem descreve o que foi feito — não o que você aprendeu, não o que foi difícil, mas o que o repositório ganhou.

## O que pode dar errado

**Tentar migrar o `index.html` do V01 diretamente para JSX.**
HTML e JSX têm diferenças que causam erros de build: `class` vira `className`, atributos como `for` viram `htmlFor`, eventos usam camelCase (`onClick`, não `onclick`), e tags sem fechamento explícito precisam ser auto-fechadas (`<br />`, não `<br>`). Não copie e cole — reescreva.

**Commitar `.env.local` com variável real.**
O `.gitignore` do `create-next-app` já inclui `.env.local`, mas é fácil fazer `git add .` sem verificar. Antes do primeiro commit, rode `git status` e confirme que `.env.local` não aparece na lista de arquivos staged. Se aparecer, remova com `git rm --cached .env.local` antes de commitar.

**Criar estrutura de pastas antes de entender o que o Next.js cria automaticamente.**
O `create-next-app` já criou `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` e outras estruturas. Entenda o que existe antes de criar pastas novas. Criar `src/pages/` por hábito do Pages Router vai confundir o App Router.

**Usar uma versão desatualizada do `create-next-app`.**
O comando `npx create-next-app@latest` garante a versão mais recente. Sem o `@latest`, o npx pode usar uma versão em cache. Se tiver dúvida, force: `npx --yes create-next-app@latest`.

## Debugging de setup

Neste capítulo não há debugging de código — não tem lógica de negócio para depurar ainda. O debugging é de setup.

Se `npm run dev` não subir na porta 3000, verifique:

1. Você está dentro da pasta `stackovia-intrastack-app/`? Rode `pwd` para confirmar.
2. A porta 3000 já está em uso? O Next.js vai sugerir outra porta automaticamente — aceite.
3. O `node_modules/` foi instalado? Se não, rode `npm install` antes de `npm run dev`.
4. Há erro no terminal? Leia a mensagem antes de pesquisar — o Next.js geralmente descreve o problema com clareza.

Quando a página abrir no browser, abra o DevTools (F12) e verifique o console. Não deve ter erros. Se aparecer um warning sobre `viewport` no `<head>`, é o comportamento esperado da página padrão — vai desaparecer quando você substituir o conteúdo de `page.tsx`.

## Code Review do Mestre Py

Antes de considerar o C01 encerrado, o Mestre Py vai verificar três coisas:

**`.env.local` está no `.gitignore`?** Se o arquivo aparece em `git status` como untracked mas deveria estar ignorado, há problema de configuração. Verifique o `.gitignore` na raiz do projeto.

**O `README.md` declara como rodar?** Abra o README gerado pelo `create-next-app` e confirme que tem pelo menos: o nome do projeto, a stack usada e o comando `npm run dev`. Não precisa ser o README final — mas precisa ser suficiente para alguém clonar e rodar sem te perguntar nada.

**O primeiro commit é semântico e não inclui `node_modules`?** Rode `git log --oneline` e veja o que foi commitado. Se `node_modules/` aparece no commit, o `.gitignore` não estava correto. Desfaça o commit, corrija e recomite.

O code review do Mestre Py não é formalidade de auditoria. É o hábito de verificar o óbvio antes de avançar — porque o óbvio esquecido é o que gera bug em PR de código complexo.

## Mãos à Obra

1. **Criar o projeto** com `npx create-next-app@latest stackovia-intrastack-app --typescript --tailwind --eslint --app --src-dir`.
2. **Instalar shadcn/ui** com `npx shadcn@latest init` (aceitar os padrões).
3. **Criar `.env.example`** com comentário de uso.
4. **Confirmar `.env.local` no `.gitignore`** antes de qualquer commit.
5. **Rodar `npm run dev`** e verificar que a página abre em `localhost:3000` sem erro no console.
6. **Fazer o primeiro commit semântico**: `feat(setup): initialize intrastack-app with Next.js, TypeScript, Tailwind and shadcn/ui`.

## Critérios de aceitação

- [ ] Projeto `stackovia-intrastack-app` criado com Next.js + TypeScript + Tailwind.
- [ ] shadcn/ui instalado e configurado (`src/components/ui/` existe).
- [ ] `npm run dev` sobe sem erro; página abre em `localhost:3000`.
- [ ] `.env.example` existe na raiz; `.env.local` está no `.gitignore`.
- [ ] Primeiro commit semântico feito; `node_modules/` não está no commit.
- [ ] README inicial explica como rodar o projeto.

## Entrega de portfólio

### Entregas obrigatórias do C01

- Repositório `stackovia-intrastack-app` criado (pode ser privado por enquanto).
- `.env.example` com comentário de uso na raiz.
- README inicial com nome do projeto, status ("em construção"), stack e instrução de `npm run dev`.
- Primeiro commit semântico no histórico do Git.

### Screenshots ou diagramas esperados

O comparativo textual de estrutura IntraStack básico vs IntraStack App (disponível neste capítulo) pode ser copiado para `diagrams/` como ponto de partida.

### Evidências esperadas

Print do `npm run dev` funcionando: browser aberto em `localhost:3000` mostrando a home do IntraStack App com o título "IntraStack App" e o parágrafo "Em construção — V02." sem erros no console.

### Limitações que devem aparecer

Projeto recém-criado; sem componentes de negócio, sem dados reais, sem testes.

### Rótulo de maturidade

**Estudo / Junior de Frontend.**

Este repositório é um projeto de aprendizado dentro da coleção Stackovia. Não representa um produto em produção, não tem backend real, não tem autenticação e não deve ser apresentado como sistema profissional completo.

## Mini post LinkedIn

> Este é apenas um esboço para uso futuro. Não publique agora.

---

**Gancho:** Comecei o V02: transformando o IntraStack básico em um app React/Next.js.

**Contexto:** O IntraStack básico foi entregue no V01 — HTML, CSS, JS e Git. Funcionava como prova de conceito. Agora o próximo card é uma versão com componentes, rotas, TypeScript e qualidade mensurável.

**O que fiz neste passo:** Criei o projeto `stackovia-intrastack-app` com Next.js + TypeScript + Tailwind + shadcn/ui. Primeiro commit semântico. `.env.local` no `.gitignore` desde o início.

**Limitação honesta:** Setup inicial. Sem funcionalidade real ainda. Dados mockados, sem backend, sem testes.

**Próximo passo:** C02 — componentes React reutilizáveis.

---

## Checklist de segurança

- [ ] `.env.example` presente com comentário de uso; nenhuma variável real no arquivo.
- [ ] `.env.local` no `.gitignore` antes do primeiro commit.
- [ ] Nenhuma variável de ambiente real commitada no repositório.
- [ ] README não expõe caminho local da máquina nem dados internos da Stackovia.

## Perguntas de revisão

1. Qual é a diferença fundamental entre um site estático e um app React/Next.js? Cite dois exemplos concretos de limitação que o IntraStack básico tem e que o IntraStack App resolve.

2. Por que o `.env.local` não deve ser versionado? O que acontece se um segredo real entrar em um commit público?

3. O que o `create-next-app` cria automaticamente? Cite pelo menos três arquivos ou pastas e explique para que servem.

4. O que é um commit semântico? Escreva um exemplo de commit semântico para a instalação do shadcn/ui.

5. Você tentou rodar `npm run dev` e a porta 3000 está ocupada. O que você faz? O Next.js vai simplesmente falhar ou há outra opção?

6. Por que o C01 não ensina React, hooks ou TypeScript avançado? O que seria perdido se esses temas entrassem agora?

## Próximo passo

Capítulo 02: você vai colocar a lista de integrantes da equipe em três partes diferentes do IntraStack App. Qualquer mudança visual vai exigir editar três arquivos separados. O Mestre Py vai perguntar: "você vai copiar isso quantas vezes?" — e a resposta vai ser: componentes React.
