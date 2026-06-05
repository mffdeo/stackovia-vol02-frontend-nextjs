---
title: "Capítulo 02 — React: componentes, JSX e props"
status: Preview
volume: 2
capitulo: 2
maturidade: "Revisado v1.0"
---

> ⚠️ **Conteúdo em construção.** Este capítulo faz parte da Stackovia Learning Series,
> desenvolvida ativamente em 2026. Para acompanhar o progresso ou contribuir,
> acesse o [repositório hub](https://github.com/mffdeo/stackovia-learning) no GitHub.


# Capítulo 02 — React: componentes, JSX e props

## Abertura narrativa na Stackovia

A tarefa parece simples: criar a página de equipe do IntraStack App.

Você abre `src/app/equipe/page.tsx`, lembra que precisa mostrar um card para cada integrante e começa a escrever. O primeiro card fica bom — nome, cargo, badge de status. Você copia o bloco, troca os valores, copia de novo.

Três cards depois, o Mestre Py para ao lado da sua tela.

"Quantas vezes você vai copiar isso?"

Você olha para o arquivo. São quarenta e tantas linhas de JSX quase idêntico. Se a designer pedir para mudar a cor do badge de `green` para `teal`, você vai precisar editar em três lugares. Se a lista crescer para dez integrantes, vira cem linhas. Se virar vinte, vira duzentas.

"Isso não é um app", diz o Mestre Py. "É HTML um pouco mais moderno."

Ele não está errado.

## Card da sprint

```text
[Card da Sprint]
Sprint:    Componentes do IntraStack App — CARD-0003
Cargo:     Júnior de frontend na Stackovia
Tarefa:    Criar os primeiros componentes reutilizáveis do
           dashboard: TeamCard, TeamList e Header.
Definição
de pronto: TeamCard, TeamList e Header criados, tipados e
           renderizando dados fictícios em /equipe.
```

Esse card define "pronto" com critério verificável: os três componentes existem, estão tipados com TypeScript e renderizam dados fictícios na rota `/equipe`. Não é "aprendi componentes" — é algo que você pode abrir no browser e mostrar.

Uma observação sobre o tamanho da sprint: cada card corresponde a um capítulo, não a uma semana de calendário. O ritmo de avanço depende do tempo que você tem e de quantas vezes precisar reler e praticar. Não trate esses cards como corrida.

## Problema de negócio

A listagem de equipe do IntraStack App precisa mostrar os integrantes com nome, cargo e status de disponibilidade. Você vai precisar reutilizar o mesmo layout de card para cada pessoa. Qualquer mudança visual — cor, espaçamento, campos — precisa refletir em todos os cards sem precisar editar cada um separadamente.

Isso é o problema real que componentes React resolvem.

## O que será construído

Ao final deste capítulo, o repositório `stackovia-intrastack-app` vai conter:

- `src/types/index.ts` — interface `TeamMember` tipando cada membro da equipe.
- `src/components/team/TeamCard.tsx` — card individual de integrante.
- `src/components/team/TeamList.tsx` — lista que recebe um array e renderiza um `TeamCard` para cada item.
- `src/components/layout/Header.tsx` — cabeçalho com título e navegação básica.
- `src/app/equipe/page.tsx` — página `/equipe` usando `TeamList`.
- `diagrams/component-tree.md` — árvore textual de componentes do IntraStack App (C02).

Dados fictícios hard-coded. Sem API, sem filtro, sem fetch.

## Exemplo antes do conceito

Antes de definir qualquer coisa, olhe para o problema concreto.

### O bloco duplicado

> **Nota:** este trecho é ilustrativo — as classes `card`, `badge-green` e `badge-red` não são Tailwind. Elas representam "algum CSS que você teria escrito" antes de padronizar com Tailwind. A versão real com classes Tailwind aparece nas tarefas do Mãos à Obra.

Este é o estado da sua página antes de aprender componentes:

```tsx
// src/app/equipe/page.tsx — versão "antes"
export default function EquipePage() {
  return (
    <main>
      <div className="card">
        <h2>Ana Costa</h2>
        <p>Cargo: Engenheira de dados</p>
        <span className="badge-green">disponível</span>
      </div>
      <div className="card">
        <h2>Bruno Lima</h2>
        <p>Cargo: Dev backend</p>
        <span className="badge-red">ocupado</span>
      </div>
      <div className="card">
        <h2>Clara Nunes</h2>
        <p>Cargo: Designer</p>
        <span className="badge-green">disponível</span>
      </div>
    </main>
  )
}
```

A estrutura é idêntica nos três blocos. A única diferença são os valores. Qualquer mudança de layout precisa ser feita em cada bloco manualmente. Qualquer novo integrante é mais uma cópia.

### O bug silencioso (INC-V02-001)

Agora imagine que você criou um componente `TeamCard` mas tipou as props como `any` — seja porque estava com pressa, porque copiou de algum lugar, ou porque o TypeScript "parou de reclamar" com essa anotação:

```tsx
// versão problemática: any silencia o TypeScript
function TeamCard({ name, cargo, status }: any) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Cargo: {cargo}</p>
      <span>{status === 'available' ? 'disponível' : 'ocupado'}</span>
    </div>
  )
}
```

Com `: any`, o TypeScript aceita qualquer valor em qualquer prop. Mais tarde, ao montar a lista, você acidentalmente passa o cargo como número:

```tsx
<TeamCard name="Ana Costa" cargo={42} status="available" />
```

O app não quebra. O TypeScript não reclama — porque `any` desliga a verificação de tipo. O browser renderiza "Cargo: 42" sem aviso nenhum. Você só descobre quando alguém vê a tela e pergunta "o que é esse número aí?".

O Mestre Py chama isso de bug silencioso: não há erro, não há warning, mas o resultado está errado. Em projetos Next.js criados com `create-next-app`, o `tsconfig.json` usa `"strict": true` por padrão — o que significa que parâmetros sem nenhuma anotação de tipo geram erro de TypeScript na própria definição da função. O `any` é a forma de silenciar esse erro sem resolver o problema: o TypeScript para de reclamar, mas você perde toda a proteção que ele oferece.

A única forma de evitar o bug silencioso é declarar a interface correta da prop.

Agora você está pronto para ouvir o que é um componente React de verdade.

## Conceitos essenciais

### Conceito 1 — Componente React: função que recebe props e retorna JSX

Um componente React é uma função TypeScript que:

1. recebe um objeto de dados chamado **props**;
2. retorna **JSX** — a sintaxe declarativa que descreve o que deve aparecer na tela.

Exemplo mínimo:

```tsx
function OlaMundo() {
  return <h1>Olá, mundo</h1>
}
```

Componentes com letra maiúscula são componentes React. `<OlaMundo />` é o componente sendo usado. `<h1>` é uma tag HTML nativa — escreve com minúscula.

O valor de um componente não está em ser uma função. Está no fato de que você escreve uma vez e usa quantas vezes precisar — com dados diferentes a cada uso.

### Conceito 2 — JSX: diferença do HTML e regras básicas

JSX parece HTML, mas é JavaScript com açúcar sintático. As diferenças que mais aparecem no dia a dia:

| HTML | JSX |
|---|---|
| `class="card"` | `className="card"` |
| `for="input-id"` | `htmlFor="input-id"` |
| Comentário `<!-- -->` | Comentário `{/* */}` |
| Múltiplos elementos soltos | Precisa de um elemento pai ou fragmento `<>` |

Você pode incluir expressões JavaScript dentro do JSX usando chaves `{}`:

```tsx
const nome = "Ana Costa"
return <h2>{nome}</h2>                                  // renderiza "Ana Costa"
return <h2>{"Ana" + " Costa"}</h2>                      // também funciona
return <h2>{42 > 0 ? "positivo" : "negativo"}</h2>      // expressão condicional
```

O que vai dentro das chaves é uma **expressão**, não um bloco de código. Você não pode usar `if/else` diretamente dentro do JSX — use o operador ternário `? :` ou mova a lógica para fora do `return`.

### Conceito 3 — Props: o contrato entre componente pai e filho

Props são os dados que o componente pai passa para o filho. Eles chegam como propriedades do objeto `props` — ou diretamente via desestruturação:

```tsx
function TeamCard({ name, role }: { name: string; role: string }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  )
}

// usando o componente:
<TeamCard name="Ana Costa" role="Engenheira de dados" />
```

Props fluem em uma única direção: de pai para filho. O filho não pode alterar as props que recebe — elas são somente leitura. Se o filho precisar mudar algo, precisa de estado — e isso é C03.

### Conceito 4 — TypeScript interface para props

Declarar a interface das props em arquivo ou tipo nomeado deixa o código mais legível e reutilizável do que tipar inline:

```tsx
interface TeamCardProps {
  name: string
  role: string
  status: 'available' | 'busy'
}

function TeamCard({ name, role, status }: TeamCardProps) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{role}</p>
      <span>{status === 'available' ? 'disponível' : 'ocupado'}</span>
    </div>
  )
}
```

Com essa interface:
- O TypeScript avisa se você passar `status="disponivel"` (valor fora do union type).
- O TypeScript avisa se você passar `cargo={42}` onde o tipo esperado é `string`.
- O editor autocompleta os nomes das props ao usar o componente.

Prop sem tipo é uma promessa sem assinatura. O TypeScript não reclama na ausência do tipo — mas o bug aparece na tela.

### Conceito 5 — Composição: componente pai usando componente filho

Composição é quando um componente renderiza outros componentes. É a forma natural de construir interfaces no React:

```tsx
function TeamList({ members }: { members: TeamMember[] }) {
  return (
    <ul>
      {members.map((member) => (
        <TeamCard
          key={member.id}
          name={member.name}
          role={member.role}
          status={member.status}
        />
      ))}
    </ul>
  )
}
```

`TeamList` é o pai. Ele recebe um array e renderiza um `TeamCard` para cada item. `TeamCard` é o filho — não sabe quantos irmãos existem; só sabe renderizar um único membro.

A propriedade `key` é obrigatória quando você renderiza uma lista. Ela ajuda o React a identificar qual item mudou quando a lista é atualizada. Use um identificador único — um `id` do dado, não o índice do array.

### Conceito 6 — Renderização condicional simples

Às vezes você quer mostrar coisas diferentes dependendo de um valor:

```tsx
// operador ternário — para dois casos
{status === 'available' ? (
  <span className="text-green-600">disponível</span>
) : (
  <span className="text-red-500">ocupado</span>
)}

// operador && — renderiza só se a condição for verdadeira
{isAdmin && <button>Editar</button>}
```

O ternário cobre a maioria dos casos de C02. Se a lógica ficar complexa — três ou mais condições, cálculos envolvidos — mova para uma variável ou função antes do `return`. Isso mantém o JSX legível.

## Estrutura-alvo e onde você está agora

Ao final deste capítulo, a estrutura relevante do repositório vai estar assim:

```text
stackovia-intrastack-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← já existe (C01) — vai receber Header
│   │   ├── page.tsx                ← já existe (C01)
│   │   └── equipe/
│   │       └── page.tsx            ← NOVO neste capítulo
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.tsx          ← NOVO neste capítulo
│   │   └── team/
│   │       ├── TeamCard.tsx        ← NOVO neste capítulo
│   │       └── TeamList.tsx        ← NOVO neste capítulo
│   └── types/
│       └── index.ts                ← NOVO neste capítulo
└── diagrams/
    └── component-tree.md           ← NOVO neste capítulo
```

O que já existe do C01: `layout.tsx`, `page.tsx` e toda a configuração do projeto Next.js.

O que nasce agora: os componentes, os tipos compartilhados e a página `/equipe`. O `layout.tsx` vai ser **editado** para incluir o `Header` — não recriado.

## Árvore de componentes

Antes de criar os arquivos, entenda como eles se relacionam:

```text
src/app/layout.tsx
  └── Header                         (cabeçalho em todas as rotas)

src/app/equipe/page.tsx
  └── TeamList                       (lista de membros)
        └── TeamCard × n             (card individual por membro)
              ├── name: string
              ├── role: string
              └── status: 'available' | 'busy'
```

`Header` é independente — não precisa saber de equipe. `TeamList` não renderiza o layout do card — só distribui os dados para `TeamCard`. `TeamCard` não sabe quantos irmãos existem — renderiza um único membro.

Essa separação de responsabilidades é o ponto central do capítulo: cada componente faz uma coisa, faz bem e pode ser testado isolado.

## O que pode dar errado?

### 1. Bug silencioso de prop sem tipo

A situação exata do INC-V02-001: você passa `cargo={42}` em vez de `cargo="dev"`. O app renderiza, o dado aparece errado na tela, não há erro no console. Só aparece na revisão visual ou quando alguém reclama. Solução: tipar todas as props com interface antes de usar o componente.

### 2. `class` em vez de `className`

Erro clássico de quem vem do HTML puro. `class` é palavra reservada em JavaScript; no JSX você usa `className`. O TypeScript acusa o erro, mas o estilo simplesmente não é aplicado — nenhum aviso em runtime, só o visual faltando.

### 3. Prop de objeto ou array sem tipar corretamente

Passar `members={membros}` para um componente que declara `members: any` é um convite para bug silencioso mais grave do que o INC-V02-001. Sempre declare a interface completa, inclusive para arrays e objetos aninhados.

### 4. Componente com responsabilidade grande demais

Se o seu `TeamCard` também faz fetch, filtra dados e gerencia estado, ele virou um componente "faz tudo" — difícil de testar, difícil de reutilizar. A regra prática: se o componente faz mais de uma coisa claramente distinta, considere dividir.

### 5. `dangerouslySetInnerHTML` sem sanitização

Nunca use `dangerouslySetInnerHTML` com dado de prop vindo do usuário sem sanitizar. Isso é uma porta de entrada para XSS. Neste capítulo não há dado de usuário — todos são fictícios e hard-coded. Mas o risco precisa estar no seu radar desde agora.

### 6. `key` faltando ou usando índice do array

Renderizar lista sem `key` gera warning no console do React. Usar o índice do array como `key` (ex.: `key={index}`) resolve o warning mas causa problemas quando a lista é reordenada ou filtrada. Use o `id` do dado sempre que possível.

## Debugging guiado

**Sintoma 1 — componente não aparece na tela**

Passo 1: verifique se o componente está importado corretamente em `equipe/page.tsx`. O erro mais comum é importação com nome errado — React é case-sensitive: `TeamCard` ≠ `teamcard`.

Passo 2: verifique se o arquivo existe no caminho correto. `components/team/TeamCard.tsx` não é o mesmo que `components/Team/TeamCard.tsx`.

Passo 3: abra o console do browser (`F12 → Console`). Erro de importação aparece lá, não na tela.

**Sintoma 2 — TypeScript acusa erro na prop**

Passo 1: leia a mensagem de erro completa — o TypeScript diz exatamente qual prop está com tipo errado e qual tipo era esperado.

Passo 2: compare o valor passado (ex.: `status="disponivel"`) com o tipo declarado na interface (ex.: `'available' | 'busy'`). Os valores do union type são case-sensitive.

Passo 3: corrija o valor passado ou atualize a interface — com atenção, porque a interface é o contrato.

**Sintoma 3 — lista renderiza vazia**

Passo 1: adicione `console.log(members)` antes do `return` em `TeamList`. Verifique se o array tem dados e se os campos batem com a interface.

Passo 2: verifique se os dados fictícios estão declarados no lugar certo e com o tipo correto (`TeamMember[]`).

Passo 3: verifique se o `map` está retornando JSX. Arrow function com chaves precisa de `return` explícito: `(member) => { return <TeamCard ... /> }`. Arrow function com parênteses dispensa: `(member) => (<TeamCard ... />)`.

**Sintoma 4 — estilo Tailwind não aplicado**

Passo 1: verifique se a classe existe exatamente como documentada pelo Tailwind (case-sensitive, sem espaços extras, sem abreviação inventada).

Passo 2: verifique se o arquivo está dentro do glob configurado em `tailwind.config.ts` — normalmente `src/**/*.tsx`.

Passo 3: reinicie o servidor com `npm run dev`. O JIT do Tailwind às vezes precisa de restart para detectar classes novas.

## Code Review do Mestre Py

Ao revisar o código do C02, o Mestre Py verifica quatro coisas:

**Aprovaria sem reserva:**
- Props com interface declarada; nenhum `any` no caminho principal.
- `TeamCard` com responsabilidade única: recebe dados e renderiza.
- `TeamList` com responsabilidade única: recebe array e distribui para `TeamCard`.
- `key` usando `id` do membro, não índice do array.
- `Header` adicionado ao `layout.tsx`, aparecendo em todas as rotas.

**Pediria ajuste:**
- Props tipadas como `any` ou sem tipo — "substitua por interface antes de continuar; prop sem tipo é dívida técnica imediata".
- `class` em vez de `className` — "o TypeScript está avisando; corrija agora, não deixe acumular".
- Array de membros com tipo incompleto — "se falta um campo, o TypeScript não vai reclamar; você vai descobrir em produção".

**Reprovaria:**
- Componente `TeamCard` fazendo fetch ou gerenciando estado — "o C02 é sobre componentes e props; estado entra no C03, fetch entra no C07".
- `dangerouslySetInnerHTML` com prop de string sem sanitização — "isso é XSS; remove agora".

**Resumo do Mestre Py:** "Props são contratos. Contrato sem assinatura não vale nada. TypeScript é a assinatura."

## Mãos à Obra

> Antes de começar: confirme que `npm run dev` está rodando e que a rota `/` do C01 ainda carrega sem erro.

### Tarefa 1 — Criar a interface `TeamMember`

Crie o arquivo `src/types/index.ts`:

```ts
// src/types/index.ts
export interface TeamMember {
  id: string
  name: string
  role: string
  status: 'available' | 'busy'
}
```

Esse arquivo vai centralizar os tipos compartilhados do projeto. Por enquanto, só `TeamMember`.

### Tarefa 2 — Criar `TeamCard`

Crie `src/components/team/TeamCard.tsx`:

```tsx
// src/components/team/TeamCard.tsx
import type { TeamMember } from '@/types'

interface TeamCardProps {
  name: string
  role: string
  status: 'available' | 'busy'
}

export function TeamCard({ name, role, status }: TeamCardProps) {
  return (
    <div className="rounded border p-4">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-600">{role}</p>
      <span className={status === 'available' ? 'text-green-600' : 'text-red-500'}>
        {status === 'available' ? 'disponível' : 'ocupado'}
      </span>
    </div>
  )
}
```

A interface `TeamCardProps` declara os três campos explicitamente — o mesmo padrão do Conceito 4. O import de `TeamMember` está aqui porque você vai precisar dele quando `TeamList` passar os dados; por ora, a interface de props é independente.

> **Nota opcional:** TypeScript tem um utility type chamado `Pick<TeamMember, 'name' | 'role' | 'status'>` que seleciona campos de outra interface sem redeclará-los. É útil para evitar duplicação, mas vai além do escopo deste capítulo. Quando o básico de props estiver fluindo, vale explorar.

### Tarefa 3 — Criar `TeamList`

Crie `src/components/team/TeamList.tsx`:

```tsx
// src/components/team/TeamList.tsx
import type { TeamMember } from '@/types'
import { TeamCard } from './TeamCard'

interface TeamListProps {
  members: TeamMember[]
}

export function TeamList({ members }: TeamListProps) {
  return (
    <ul className="grid gap-4">
      {members.map((member) => (
        <li key={member.id}>
          <TeamCard
            name={member.name}
            role={member.role}
            status={member.status}
          />
        </li>
      ))}
    </ul>
  )
}
```

`key={member.id}` está no `<li>`, não no `<TeamCard>`. O `key` pertence ao elemento raiz da iteração do `map`.

### Tarefa 4 — Criar `Header`

Crie `src/components/layout/Header.tsx`:

```tsx
// src/components/layout/Header.tsx
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b px-6 py-3">
      <nav className="flex items-center gap-4">
        <span className="font-bold">IntraStack App</span>
        <Link href="/">Home</Link>
        <Link href="/equipe">Equipe</Link>
      </nav>
    </header>
  )
}
```

Por ora, o `Header` é estático: título e dois links. Ele vai crescer nos capítulos seguintes conforme o projeto ganhar rotas e contexto de autenticação.

### Tarefa 5 — Criar a página `/equipe`

Crie `src/app/equipe/page.tsx`:

```tsx
// src/app/equipe/page.tsx
import { TeamList } from '@/components/team/TeamList'
import type { TeamMember } from '@/types'

const TEAM: TeamMember[] = [
  { id: '1', name: 'Ana Costa', role: 'Engenheira de dados', status: 'available' },
  { id: '2', name: 'Bruno Lima', role: 'Dev backend', status: 'busy' },
  { id: '3', name: 'Clara Nunes', role: 'Designer', status: 'available' },
]

export default function EquipePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Equipe</h1>
      <TeamList members={TEAM} />
    </main>
  )
}
```

O array `TEAM` está hard-coded na página — intencional porque não há API ainda. Abra `http://localhost:3000/equipe` e confirme que os três cards aparecem.

### Tarefa 6 — Adicionar `Header` ao layout raiz

Edite `src/app/layout.tsx` e adicione o `Header` ao corpo:

```tsx
// src/app/layout.tsx (trecho relevante — adapte ao que já existe no arquivo)
import { Header } from '@/components/layout/Header'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
```

Após isso, o `Header` aparece em todas as rotas. Confirme navegando entre `/` e `/equipe`.

### Tarefa 7 — Criar `diagrams/component-tree.md`

Crie `diagrams/component-tree.md` na raiz do repositório:

```markdown
# Árvore de componentes — IntraStack App (C02)

## Layout raiz

src/app/layout.tsx
  └── Header (src/components/layout/Header.tsx)

## Página /equipe

src/app/equipe/page.tsx
  └── TeamList (src/components/team/TeamList.tsx)
        └── TeamCard × n (src/components/team/TeamCard.tsx)
              ├── name: string
              ├── role: string
              └── status: 'available' | 'busy'

## Tipos compartilhados

src/types/index.ts
  └── TeamMember { id: string, name: string, role: string, status: 'available' | 'busy' }
```

## Critérios de aceitação

- [ ] `src/types/index.ts` existe com interface `TeamMember` completa.
- [ ] `TeamCard.tsx` existe com props tipadas — sem `any`.
- [ ] `TeamList.tsx` existe e usa `key={member.id}` (não índice do array).
- [ ] `Header.tsx` existe com links para `/` e `/equipe`.
- [ ] Rota `/equipe` renderiza os três cards com dados fictícios.
- [ ] `Header` aparece em todas as rotas (adicionado ao `layout.tsx`).
- [ ] `diagrams/component-tree.md` criado.
- [ ] Nenhum `dangerouslySetInnerHTML` no código.
- [ ] `npm run dev` sem erros de TypeScript no terminal.

## Checklist de segurança

- [ ] Nenhum `dangerouslySetInnerHTML` sem justificativa documentada.
- [ ] Dados fictícios sem informação sensível real (nome real, e-mail, CPF, token).
- [ ] Props não usadas para injetar HTML não controlado.
- [ ] Nenhum dado real de pessoa, empresa ou cliente nos dados fictícios.

## Entrega de portfólio

### Entregas obrigatórias do C02

1. `src/types/index.ts` com interface `TeamMember`.
2. `src/components/team/TeamCard.tsx` com props tipadas.
3. `src/components/team/TeamList.tsx` renderizando dados fictícios.
4. `src/components/layout/Header.tsx`.
5. `src/app/equipe/page.tsx` com rota funcional.
6. `diagrams/component-tree.md`.
7. Commit semântico: `feat(components): add TeamCard, TeamList and Header`.

### Screenshots ou diagramas esperados

- Screenshot da página `/equipe` com os cards renderizados.
- Screenshot do editor mostrando a interface `TeamMember` tipada.

> `assets/screenshots/` é **opcional** neste capítulo. Crie a pasta somente se tiver screenshot a guardar.

### Rótulo de maturidade

Estudo / Junior de Frontend.

### Limitações que devem aparecer no portfólio

Dados fictícios hard-coded. Sem API, sem filtro, sem busca. Sem `useState` ou hooks — componentes puramente declarativos.

## Mini post LinkedIn

> Este esboço é para reutilização futura. Não publique agora — o projeto do volume ainda está em construção.

---

Parei de copiar HTML e criei meu primeiro componente React reutilizável.

Estava montando a listagem de equipe do IntraStack App e percebi que tinha o mesmo bloco de card duplicado três vezes. Qualquer mudança exigiria editar cada um separadamente.

Solução: extrai `TeamCard`, criei `TeamList` para iterar o array, adicionei `Header` ao layout raiz e declarei a interface `TeamMember` com TypeScript.

Aprendi na prática o que é um bug silencioso de prop sem tipo — e por que interface TypeScript existe.

Stack: React, Next.js App Router, TypeScript.

Limitação honesta: dados fictícios hard-coded, sem estado, sem API.

---

## Perguntas de revisão

1. Qual é a diferença entre `class` e `className` no JSX? Por que essa diferença existe?
2. O que acontece se você não passar a propriedade `key` ao renderizar uma lista com `map`?
3. O que diferencia props de estado (`useState`)? Por que o C02 não usa estado?
4. Por que `TeamCardProps` declara os campos explicitamente em vez de usar `any`? Qual é o custo de usar `any` nas props?
5. Qual é o bug silencioso do INC-V02-001 e como o TypeScript o previne?
6. O que aconteceria se `TeamCard` fizesse o fetch dos dados em vez de recebê-los por props?
7. Por que `Header` não recebe props neste capítulo? Em que situação ele precisaria receber?

## Próximo passo

O IntraStack App agora tem componentes tipados e dados fictícios. O próximo card vai propor um filtro de equipe — o leitor vai implementar o input, mas a lista não vai atualizar quando alguém digitar. O filtro precisa de estado.

Esse é o ponto de entrada do Capítulo 03: `useState`, eventos e ciclo de renderização do React.
