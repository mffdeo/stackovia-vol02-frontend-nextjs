---
title: "Capítulo 03 — Estado e hooks: o IntraStack se torna interativo"
status: Preview
volume: 2
capitulo: 3
maturidade: "Revisado v1.0"
---

> ⚠️ **Conteúdo em construção.** Este capítulo faz parte da Stackovia Learning Series,
> desenvolvida ativamente em 2026. Para acompanhar o progresso ou contribuir,
> acesse o [repositório hub](https://github.com/mffdeo/stackovia-learning) no GitHub.


# Capítulo 03 — Estado e hooks: o IntraStack se torna interativo

## Abertura narrativa na Stackovia

O campo de busca está lá, bem posicionado acima da lista de equipe.

Você digitou dois caracteres no `<input>`. Três. Quatro. A lista não muda. Os três cards continuam lá — Ana, Bruno, Clara — indiferentes ao que você digita.

Você relê o código. Criou uma variável `filtro`, atualizou o valor no `onChange`, usou o valor para filtrar o array. Parece certo. Você digita de novo. A lista continua parada.

O Mestre Py aparece do seu lado. Lê o código por um segundo.

"Por que você acha que digitar no input muda a lista?"

Você começa a explicar: "porque eu atualizo a variável e depois filtro o array—"

"Uma variável JavaScript comum não tem memória", ele interrompe. "Você atualiza o valor, mas o React não sabe que aconteceu algo. O componente não re-executa. A lista que está na tela é a do render anterior — e ela vai ficar assim."

Esse é o gap. O input captura o texto, mas a lista não sabe que o texto mudou. Para ligar os dois, você precisa de estado.

## Card da sprint

```text
[Card da Sprint]
Sprint:    Interatividade do IntraStack App — CARD-0004
Cargo:     Júnior de frontend na Stackovia
Tarefa:    Implementar filtro interativo na lista de equipe
           e indicador de disponibilidade reativo.
Definição
de pronto: Filtro de texto atualiza a lista em tempo real;
           toggle de disponibilidade em cada TeamCard.
```

O "em tempo real" não é marketing. É o critério técnico: cada tecla pressionada no input deve refletir imediatamente na lista. Sem botão de confirmar, sem reload, sem delay.

## Problema de negócio

A lista de equipe do IntraStack App mostra dados estáticos. O gestor quer poder digitar o nome de um integrante e ver só aquele card. Além disso, o status de disponibilidade precisa ser interativo: qualquer membro deve poder alternar entre "disponível" e "ocupado" direto na interface.

Sem estado, os componentes do C02 são decoração. Com estado, eles se tornam interface.

## O que será construído

Ao final deste capítulo, dois arquivos do repositório serão modificados:

- `src/components/team/TeamList.tsx` — adiciona input de filtro e lógica de filtragem reativa.
- `src/components/team/TeamCard.tsx` — adiciona toggle de disponibilidade com estado local.

Nenhum arquivo novo nos componentes. Nenhuma API. O estado vive inteiramente no cliente, nos dados fictícios do C02.

## Conceito 1 — Variável local versus estado

Veja o código que não funciona:

```tsx
// TeamList.tsx — versão que não funciona
export function TeamList({ members }: TeamListProps) {
  let filtro = ''                         // variável JavaScript comum

  const membrosFiltrados = members.filter((m) =>
    m.name.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div>
      <input
        value={filtro}
        onChange={(e) => { filtro = e.target.value }}  // atualiza a variável
        placeholder="Filtrar por nome..."
      />
      <ul>
        {membrosFiltrados.map((member) => (
          <li key={member.id}><TeamCard {...member} /></li>
        ))}
      </ul>
    </div>
  )
}
```

O problema está aqui: `filtro = e.target.value` atualiza o valor da variável em memória, mas não informa o React que algo mudou. O React não re-executa o componente. `membrosFiltrados` foi calculado na primeira renderização com `filtro = ''`, e vai continuar sendo aquele valor.

Ler isso é desconfortável porque parece certo. E é exatamente por isso que causa frustração.

A distinção fundamental:

- **Variável local (`let filtro`)**: existe durante a execução da função do componente. Quando o componente re-renderiza (por qualquer motivo), a variável é redeclarada do zero. Atualizá-la não causa re-render.
- **Estado (`useState`)**: é gerenciado pelo React fora da função do componente. Quando o estado muda, o React agenda um re-render. Na próxima execução da função, o novo valor está disponível.

"Estado é a memória do componente entre renders", diz o Mestre Py. "Variável local é a memória durante um único render."

## Conceito 2 — useState: declaração e atualização

A correção é substituir `let filtro = ''` por `useState`:

```tsx
import { useState } from 'react'

// dentro do componente:
const [filtro, setFiltro] = useState<string>('')
```

Três coisas acontecem aqui:

1. `filtro` — o valor atual do estado. Na primeira renderização, é `''`.
2. `setFiltro` — a função que atualiza o estado. Quando chamada, o React agenda um re-render.
3. `useState<string>('')` — o tipo explícito `<string>` é opcional aqui porque TypeScript infere `string` do valor inicial `''`. Mas em estados mais complexos — `useState<TeamMember[]>([])`, por exemplo — declarar o tipo explicitamente evita surpresas.

O `onChange` agora usa `setFiltro`:

```tsx
onChange={(e) => setFiltro(e.target.value)}
```

Cada tecla pressionada:

1. Dispara `onChange`.
2. `setFiltro` é chamado com o novo valor.
3. React agenda re-render de `TeamList`.
4. O componente re-executa. `filtro` agora tem o novo valor.
5. `membrosFiltrados` é recalculado com o filtro atualizado.
6. O DOM é atualizado com a lista filtrada.

## Ciclo de rendering

```text
Usuário digita no input
  → handler chama setFiltro(novoValor)
    → React agenda re-render de TeamList
      → TeamList re-executa com filtro = novoValor
        → membrosFiltrados recalculado inline
          → DOM atualizado com lista filtrada
```

Esse ciclo é o coração do React. Não é magia — é uma função que re-executa com valores diferentes. O que muda é o valor do estado que o React entrega para a função na próxima execução.

Um detalhe importante: `membrosFiltrados` não é estado — é um valor computado a partir do estado e das props:

```tsx
const membrosFiltrados = members.filter((m) =>
  m.name.toLowerCase().includes(filtro.toLowerCase())
)
```

Isso roda a cada render automaticamente. Não precisa de `useState` nem de `useEffect` para dados locais. Você não está "salvando" a lista filtrada — está calculando-a na hora.

Evitar estado desnecessário é uma das habilidades mais importantes em React. Se um valor pode ser computado de estado ou props, compute — não armazene.

## Conceito 3 — useEffect: quando estado não é suficiente

Agora o filtro funciona. Mas o Mestre Py tem uma pergunta.

"Você implementou o filtro direto no corpo do componente. E se precisasse sincronizar algo externo quando o filtro muda? Salvar no `localStorage`, por exemplo. Como faria?"

Você pensa em colocar o `localStorage.setItem` dentro do `onChange`. Funciona — e é uma escolha válida para casos simples. Mas há uma forma mais explícita de declarar essa intenção, especialmente quando o efeito colateral não está ligado a um evento específico, mas sim à mudança de um valor:

```tsx
import { useEffect } from 'react'

// dentro do componente, depois do useState:
useEffect(() => {
  console.log('filtro mudou para:', filtro)
}, [filtro])
```

O `useEffect` executa um efeito — código com consequência externa — sempre que os valores no array de dependências mudam. Aqui: executa quando `filtro` muda.

Três partes:

1. **A função** — o que executar.
2. **O array de dependências** — quando executar.
3. **O retorno opcional** — como limpar (cleanup).

O array de dependências é onde a maioria dos erros acontece.

## INC-V02-002 — A armadilha do array vazio

O INC-V02-002 é a situação mais comum de `useEffect` mal-entendido. O desenvolvedor vê o array de dependências e pensa: "se eu deixar vazio, o effect não vai ficar chamando toda hora. Mais eficiente."

Lógica razoável, resultado errado.

Veja o código com bug intencional:

```tsx
// BUGADO — array vazio faz o effect rodar só na montagem
useEffect(() => {
  const resultado = members.filter((m) =>
    m.name.toLowerCase().includes(filtro.toLowerCase())
  )
  console.log('lista filtrada:', resultado)
}, [])  // ← array vazio
```

Abra o console e teste: ao digitar no input, a mensagem não aparece. O effect executou uma vez, na montagem do componente, quando `filtro` era `''`. A partir daí, o React não re-executa o effect — porque nenhuma dependência mudou. Para o React, não há dependência declarada.

O console vai mostrar a lista completa uma vez, e depois silêncio. Você digita, a lista na tela muda (porque o filtro inline funciona), mas o `useEffect` está "preso" no valor inicial de `filtro`. Isso é stale state.

Para corrigir, declare `filtro` como dependência:

```tsx
// CORRIGIDO — roda sempre que filtro muda
useEffect(() => {
  const resultado = members.filter((m) =>
    m.name.toLowerCase().includes(filtro.toLowerCase())
  )
  console.log('lista filtrada:', resultado)
}, [filtro])  // ← filtro no array
```

Agora o console mostra a lista atualizada a cada tecla. (Rigorosamente, `members` também deveria estar no array — o linter `eslint-plugin-react-hooks` flagraria isso em código real. Para esta demo descartável, `filtro` é suficiente para demonstrar o ponto principal.)

O linter do React avisa automaticamente sobre dependências faltantes — ative-o se ainda não fez.

A lição do Mestre Py: "Array vazio não é 'roda sempre' — é 'roda uma vez e esquece'. Se você tem uma variável que o effect usa, ela vai para o array de dependências. Sem exceção."

> **Nota:** Nos próximos capítulos, `useEffect` vai aparecer para fetch de API. Quando isso acontecer, o array de dependências será discutido com mais profundidade. Por ora, a regra prática é: toda variável que o código dentro do `useEffect` lê deve estar no array.

## Conceito 4 — useState para toggle de disponibilidade

O segundo `useState` do capítulo demonstra um uso diferente: estado booleano com toggle.

Em `TeamCard`, o status de disponibilidade atualmente vem da prop e é imutável — o componente só renderiza, não interage. Agora o leitor vai adicionar um botão de alternância.

O estado inicial vem da prop `status`:

```tsx
const [disponivel, setDisponivel] = useState<boolean>(status === 'available')
```

O tipo explícito `<boolean>` é opcional (TypeScript infere de `status === 'available'`), mas declarar torna a intenção clara.

O toggle usa a forma funcional de atualização — recomendada quando o novo estado depende do anterior:

```tsx
onClick={() => setDisponivel((prev) => !prev)}
```

Por que `(prev) => !prev` em vez de `!disponivel`? Porque quando há múltiplos updates no mesmo ciclo de rendering, a forma funcional garante que cada update trabalha com o valor mais recente, não com o valor da closure. Para um toggle simples como esse, a diferença é mínima — mas o padrão é bom desde o início.

## 'use client' — quando o componente precisa de estado

Antes de implementar, um detalhe necessário.

Os componentes do C02 eram Server Components por padrão no Next.js App Router: executam no servidor, sem acesso a hooks do React, sem interatividade. Para usar `useState`, o componente precisa ser um Client Component.

A diretiva é a primeira linha do arquivo, antes de qualquer import:

```tsx
'use client'
```

`TeamList` e `TeamCard` recebem essa diretiva neste capítulo porque ambos passam a usar `useState`. Sem ela, o TypeScript/Next.js acusa erro em tempo de desenvolvimento — o que é bom: você descobre na hora, não em produção.

A regra prática: se o componente usa hook (`useState`, `useEffect`, handlers de evento), começa com `'use client'`. A discussão completa sobre Server vs Client Components no App Router entra nos capítulos futuros do volume.

## Estrutura-alvo e onde você está agora

```text
stackovia-intrastack-app/
├── src/
│   ├── components/
│   │   └── team/
│   │       ├── TeamCard.tsx   ← MODIFICADO: + 'use client', toggle de disponibilidade
│   │       └── TeamList.tsx   ← MODIFICADO: + 'use client', useState, filtro, useEffect demo
│   └── ...
└── diagrams/
    ├── component-tree.md      ← já existe (C02)
    └── rendering-cycle.md     ← NOVO neste capítulo
```

Nenhum arquivo novo nos componentes. Dois arquivos modificados. Um diagrama adicionado.

## O que pode dar errado?

### 1. useEffect com array vazio (INC-V02-002)

Já demonstrado acima. Sintoma: effect executa uma vez e ignora mudanças subsequentes. Investigação: `console.log` dentro do effect. Correção: adicionar a variável ao array de dependências.

### 2. Re-render infinito

Se o array de dependências contém um objeto ou array criado dentro do componente, o React detecta uma nova referência a cada render e re-executa o effect, que muda estado, que dispara re-render, que cria novo objeto, que re-executa o effect:

```tsx
// PROBLEMA: novo objeto criado a cada render
useEffect(() => {
  console.log('executou')
}, [{ id: 1 }])  // ← nova referência em todo render = loop
```

Solução: use valores primitivos (`string`, `number`, `boolean`) no array de dependências sempre que possível. Se precisar de objeto, extraia para fora do componente ou use `useMemo` (mencionado como referência futura — entra nos capítulos avançados).

### 3. Estado desnecessário para valor computável

Transformar `membrosFiltrados` em estado (`useState<TeamMember[]>`) é um erro comum. Não guarde o que pode ser calculado. `membrosFiltrados` deriva de `members` (prop) e `filtro` (estado) — se um deles mudar, o componente re-renderiza e o cálculo acontece automaticamente. Estado desnecessário cria problemas de sincronização: você acaba com dois valores que precisam ser mantidos iguais, manualmente.

### 4. Prop drilling prematuro

Se o filtro precisasse ser compartilhado entre várias partes da aplicação, a solução seria elevar o estado ao componente pai. Por ora, `filtro` é local em `TeamList` — ele não precisa sair dali. Elevar estado sem necessidade aumenta o acoplamento sem benefício.

### 5. Estado sensível exposto no cliente

Neste capítulo os dados são fictícios. Mas o padrão merece atenção desde agora: não coloque em estado do cliente dados que não devem trafegar para o browser — tokens, senhas, chaves de API. Estado do cliente é visível no DevTools de qualquer pessoa.

## Debugging guiado

**Sintoma 1 — filtro não atualiza a lista**

Passo 1: confirme que o componente tem `'use client'` como primeira linha. Sem ela, hooks não funcionam no App Router.

Passo 2: adicione `console.log('render, filtro:', filtro)` no início do componente, antes do `return`. Se o log aparecer a cada tecla, o estado está sendo atualizado — o problema está na lógica do filtro. Se não aparecer, o estado não está sendo atualizado.

Passo 3: verifique se o `onChange` chama `setFiltro(e.target.value)` e não algum valor estático. Um erro comum é copiar o handler de outro lugar e esquecer de trocar o argumento.

**Sintoma 2 — useEffect não executa quando esperado**

Passo 1: adicione `console.log` como primeira linha dentro do effect para confirmar quando está disparando.

Passo 2: verifique o array de dependências. Cada variável que o código do effect lê deve estar listada.

Passo 3: se o effect dispara mas com valor errado (`filtro` sempre `''`), é stale state — o effect capturou o valor inicial e não foi re-registrado. Corrija o array de dependências.

**Sintoma 3 — toggle não persiste na interação com o filtro**

Se você filtra e o status dos cards parece resetar, verifique se os cards têm `key={member.id}`. Quando `key` muda entre renders (por exemplo, se você usar índice do array como key e o array for filtrado), o React desmonta e remonta o componente — e o estado local é descartado.

**Sintoma 4 — TypeError ao filtrar**

`members.filter` falha se `members` for `undefined`. Verifique se a página continua passando o array `TEAM` para `TeamList`. Com TypeScript e props tipadas, esse erro aparece em tempo de compilação — mais um argumento para não usar `any`.

## Code Review do Mestre Py

Ao revisar o código do C03, o Mestre Py verifica cinco pontos:

**Aprovaria sem reserva:**
- `'use client'` em ambos os componentes que usam hooks.
- Filtro implementado como valor computado inline, sem `useEffect` desnecessário.
- Array de dependências do `useEffect` correto e completo.
- Toggle com forma funcional `(prev) => !prev`.
- Nenhum `any` introduzido.

**Pediria ajuste:**
- `useEffect` para filtro de dado local — "você está usando um efeito onde não há efeito; compute inline".
- Array de dependências incompleto — "o linter está avisando por um motivo; não silencie o warning, corrija a causa".
- Estado para valor computável — "se você pode calcular de props ou estado existente, calcule; não armazene".

**Reprovaria:**
- Re-render infinito por objeto no array de dependências — "isso vai para produção e vai explodir; reproduza localmente, leia o console, corrija antes de fazer push".
- `'use client'` faltando em componente com hook — "o TypeScript está dizendo que não pode usar isso aqui; leia o erro".

**Resumo do Mestre Py:** "Toda variável que o componente lembra entre renders é estado. Todo valor que você pode calcular de estado ou props não é estado — é consequência. Confundir os dois é a raiz de metade dos bugs de React."

## Mãos à Obra

> Antes de começar: confirme que `npm run dev` está rodando e que `/equipe` ainda renderiza os três cards do C02.

### Tarefa 1 — Adicionar `'use client'` e `useState` em `TeamList`

Abra `src/components/team/TeamList.tsx`. Adicione `'use client'` como primeira linha, importe `useState` e implemente o filtro:

```tsx
'use client'

import { useState } from 'react'
import type { TeamMember } from '@/types'
import { TeamCard } from './TeamCard'

interface TeamListProps {
  members: TeamMember[]
}

export function TeamList({ members }: TeamListProps) {
  const [filtro, setFiltro] = useState<string>('')

  const membrosFiltrados = members.filter((m) =>
    m.name.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Filtrar por nome..."
        className="border rounded px-3 py-2 mb-4 w-full"
      />
      <ul className="grid gap-4">
        {membrosFiltrados.map((member) => (
          <li key={member.id}>
            <TeamCard
              name={member.name}
              role={member.role}
              status={member.status}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Abra `http://localhost:3000/equipe`. Digite "Ana" no input — só o card da Ana deve aparecer. Apague — os três voltam.

Adicione ao início do componente, antes do `return`:

```tsx
console.log('render, filtro:', filtro)
```

Observe o console do browser: uma linha por tecla pressionada. Esse é o ciclo de rendering em ação.

### Tarefa 2 — Demonstrar o bug do useEffect com array vazio

Ainda em `TeamList`, importe `useEffect` junto com `useState`:

```tsx
import { useState, useEffect } from 'react'
```

Adicione após `membrosFiltrados`:

```tsx
// BUG INTENCIONAL — não use este padrão para filtro local
useEffect(() => {
  console.log('[useEffect] nomes filtrados:', membrosFiltrados.map((m) => m.name))
}, [])  // array vazio — roda só na montagem
```

Salve e abra o console. Você vai ver o log uma vez, com os três nomes. Agora digite no input — o console não mostra mais nada. O effect está "preso" no valor inicial de `filtro`. Isso é o INC-V02-002.

### Tarefa 3 — Corrigir o array de dependências

Altere o array de dependências:

```tsx
useEffect(() => {
  console.log('[useEffect] nomes filtrados:', membrosFiltrados.map((m) => m.name))
}, [filtro])  // correto — roda quando filtro muda
```

Salve. Agora o console mostra os nomes filtrados a cada tecla. O effect está sincronizado.

Depois de confirmar o comportamento, **remova o `useEffect`** — ele foi só para demonstração. Para filtro de dados locais, o valor computado inline já é suficiente e mais simples.

### Tarefa 4 — Remover o console.log de render

Remova o `console.log('render, filtro:', filtro)` adicionado na Tarefa 1. Logs de debug não devem ir para o código final.

### Tarefa 5 — Adicionar `'use client'` e toggle em `TeamCard`

Abra `src/components/team/TeamCard.tsx`. Adicione `'use client'` e `useState`:

```tsx
'use client'

import { useState } from 'react'

interface TeamCardProps {
  name: string
  role: string
  status: 'available' | 'busy'
}

export function TeamCard({ name, role, status }: TeamCardProps) {
  const [disponivel, setDisponivel] = useState<boolean>(status === 'available')

  return (
    <div className="rounded border p-4">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-gray-600">{role}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={disponivel ? 'text-green-600' : 'text-red-500'}>
          {disponivel ? 'disponível' : 'ocupado'}
        </span>
        <button
          onClick={() => setDisponivel((prev) => !prev)}
          className="text-xs border rounded px-2 py-1 ml-2"
        >
          Alternar
        </button>
      </div>
    </div>
  )
}
```

Acesse `/equipe` e clique em "Alternar" em qualquer card. O indicador deve alternar entre "disponível" e "ocupado". Filtre por nome — o estado local de cada card persiste enquanto o card está visível na lista.

### Tarefa 6 — Criar `diagrams/rendering-cycle.md`

Crie `diagrams/rendering-cycle.md` na raiz do repositório:

```markdown
# Ciclo de rendering — IntraStack App (C03)

## Filtro de lista (useState)

Usuário digita no input
  → onChange chama setFiltro(novoValor)
    → React agenda re-render de TeamList
      → TeamList re-executa com filtro = novoValor
        → membrosFiltrados recalculado inline
          → DOM atualizado com lista filtrada

## Toggle de disponibilidade (useState)

Usuário clica em "Alternar"
  → onClick chama setDisponivel((prev) => !prev)
    → React agenda re-render de TeamCard
      → TeamCard re-executa com disponivel = !valorAnterior
        → DOM atualizado com novo indicador

## Regra

Estado muda → React re-renderiza → DOM atualiza.
Variável local muda → nada acontece.
```

## Critérios de aceitação

- [ ] Filtro de texto atualiza a lista em tempo real (a cada tecla).
- [ ] `membrosFiltrados` computado inline, sem `useEffect` no caminho principal.
- [ ] `useEffect` com array `[]` demonstrado (bug) e corrigido (com `[filtro]`).
- [ ] `useEffect` de demonstração removido do código final.
- [ ] Toggle de disponibilidade funcional em `TeamCard`.
- [ ] `'use client'` em ambos os componentes que usam hooks.
- [ ] `diagrams/rendering-cycle.md` criado.
- [ ] Nenhum `any` introduzido.
- [ ] `npm run dev` sem erros de TypeScript.

## Checklist de segurança

- [ ] Nenhum dado sensível em estado do cliente.
- [ ] `dangerouslySetInnerHTML` ausente.
- [ ] Input de filtro não executa código — apenas filtra strings locais.
- [ ] Nenhum dado real de pessoa, empresa ou cliente nos dados fictícios.

## Entrega de portfólio

### Entregas obrigatórias do C03

1. `src/components/team/TeamList.tsx` modificado com filtro reativo.
2. `src/components/team/TeamCard.tsx` modificado com toggle de disponibilidade.
3. `diagrams/rendering-cycle.md` com diagrama do ciclo.
4. Commit semântico: `feat(state): add interactive filter to TeamList`.

### Screenshots ou diagramas esperados

- Gif ou vídeo curto do filtro funcionando (digitar "Ana" → lista reduz → apagar → lista volta).
- Print do console mostrando re-renders ao digitar (antes de remover o log).

> `assets/screenshots/` é opcional neste capítulo. Crie somente se tiver evidência a guardar.

### Rótulo de maturidade

Estudo / Junior de Frontend.

### Limitações que devem aparecer no portfólio

Filtro em dados fictícios locais. Sem debounce. Sem API. Estado local e efêmero — recarregar a página redefine tudo.

## Mini post LinkedIn

> Este esboço é para reutilização futura. Não publique agora — o projeto do volume ainda está em construção.

---

De componente estático para interface reativa: entendi por que o React re-renderiza.

Estava montando o filtro de equipe do IntraStack App. Criei a variável, atualizei no `onChange`, filtrei o array. A lista não mudava.

O problema: variável JavaScript não tem memória entre renders. O React não sabe que ela mudou.

Solução: `useState`. Cada tecla chama `setFiltro` → React re-renderiza → `membrosFiltrados` recalcula inline → DOM atualiza.

Aprendi também a armadilha do `useEffect` com array `[]`: o effect roda uma vez e "esquece" de observar o estado. Toda variável que o effect usa vai para o array de dependências.

Stack: React, Next.js App Router, TypeScript.

Limitação honesta: filtro em dados fictícios locais, sem API, sem debounce.

---

## Perguntas de revisão

1. Qual é a diferença entre `let filtro = ''` e `useState<string>('')`? Por que só o segundo causa re-render?
2. Por que `membrosFiltrados` não precisa ser estado (`useState`)? Em que situação seria necessário armazená-lo em estado?
3. O que acontece quando o array de dependências do `useEffect` está vazio? Quando faz sentido deixá-lo vazio de propósito?
4. Por que o toggle usa `(prev) => !prev` em vez de `!disponivel`? Quando essa diferença importa?
5. O que é `'use client'` e por que `TeamList` e `TeamCard` precisam disso a partir deste capítulo?
6. Se `filtro` fosse necessário em outro componente além de `TeamList`, o que precisaria mudar na arquitetura?
7. Qual é o risco de colocar um objeto criado inline (ex.: `{ id: 1 }`) no array de dependências do `useEffect`?

## Próximo passo

O filtro funciona. O toggle funciona. Mas tente abrir `http://localhost:3000/equipe` diretamente pela URL em uma aba nova — ou enviar esse link para alguém. Em alguns ambientes de deploy, o navegador retorna 404.

Isso não é bug de React. É uma questão de roteamento. O Capítulo 04 resolve: como o App Router do Next.js transforma a estrutura de pastas em rotas, o que acontece quando o servidor não reconhece uma rota client-side e como navegar entre páginas sem reload.
