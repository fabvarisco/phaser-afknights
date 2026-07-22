# Documentação de Tarefas — AFKnights

> Plano de execução revisado. Última atualização: 2026-07-21.
> Escopo: client-side com Supabase (Auth + Postgres + Realtime). Sem backend próprio, sem Redis, sem bosses. Combate permanece como está.

## 1. Visão geral das fases

```
Fase 1: Login e Persistência (Supabase)
        └── T-1.1..T-1.5
             │
             ▼
Fase 2: Heróis, Itens e Equipamentos
        └── T-2.1..T-2.8
             │
             ├──────────────┐
             ▼              ▼
        Fase 3:         Fase 4:
        Social/Chat     PvP e Ranking
        T-3.1..T-3.4    T-4.1..T-4.3
```

Fases 3 e 4 podem ser paralelizadas após a Fase 2.

## 2. Convenções

- **Branch:** `feat/fase-<N>-<slug-curto>` (ex: `feat/fase-1-supabase-auth`).
- **Commit:** prefixo `[F<N>]` (ex: `[F1] add supabase client singleton`).
- **Rodar frontend:** `npm run dev` na raiz.
- **Lint:** `npx eslint src`.
- **Variáveis de ambiente:** `.env.local` no frontend (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## 3. Template de tarefa

```
T-XX.YY — Título
- Descrição
- Arquivos
- Critério de done
- Estimativa: P (≤ 2h) / M (≤ 1 dia) / G (> 1 dia)
- Depende de
```

---

## Fase 1 — Login e Persistência (Supabase)

**Objetivo:** substituir o login fake e os dados em memória (`default_data.json`) por autenticação real e persistência no Supabase Postgres.

### T-1.1 — Criar projeto Supabase + schema inicial
- **Descrição:** Criar projeto no Supabase. Definir schema com migrations em `supabase/migrations/`. Tabelas: `player_data`, `parties`, `inventory`, `equipment`, `friends`, `messages`, `daily_rewards`, `daily_streaks`, `pvp_matches`, `rankings`. RLS habilitado em todas as tabelas (política padrão: usuário só acessa seus próprios dados via `auth.uid()`).
- **Arquivos:** novo `supabase/migrations/*.sql`.
- **Critério de done:** `supabase db reset` recria o schema do zero sem erros; `SELECT` em tabelas com RLS ativo retorna vazio para anon sem JWT.
- **Estimativa:** G
- **Depende de:** —

### T-1.2 — Client Supabase singleton
- **Descrição:** Criar `src/services/supabase.js` exportando a instância única do `@supabase/supabase-js` inicializada com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Adicionar `@supabase/supabase-js` ao `package.json`.
- **Arquivos:** novo `src/services/supabase.js`, `package.json`.
- **Critério de done:** `import { supabase } from './services/supabase'` funciona; `supabase.auth.getSession()` retorna sem erro.
- **Estimativa:** P
- **Depende de:** T-1.1

### T-1.3 — Tela de login real (substituir TitleScene.login)
- **Descrição:** Substituir `TitleScene.login()` (linhas 37-40, hoje cria `PlayerData` em memória) por formulário de email/senha usando phaser3-rex-plugins TextEdit. JWT é gerenciado automaticamente pelo SDK do Supabase no `localStorage`. Refresh de página recupera sessão via `supabase.auth.getSession()` sem exigir login novo.
- **Arquivos:** `src/scenes/TitleScene.js`, novo `src/services/auth.js`.
- **Critério de done:** Registrar e logar funciona; fechar e reabrir aba mantém sessão; logout limpa sessão.
- **Estimativa:** M
- **Depende de:** T-1.2

### T-1.4 — Sincronizar player_data com Supabase
- **Descrição:** Em `GameScene.create()`, carregar `player_data` do Supabase (tabela `player_data`) em vez de `this.cache.game.player_data` passado pelo `TitleScene`. Em `GameScene.rewards()`, persistir o estado atualizado no Supabase — substitui a linha comentada do Firebase (linha ~186). Criar `src/services/playerService.js` com `fetchPlayerData(userId)` e `savePlayerData(userId, data)`.
- **Arquivos:** `src/scenes/GameScene.js` (funções `create` e `rewards`), novo `src/services/playerService.js`.
- **Critério de done:** Vencer um combate persiste ouro/XP/level no Supabase; refresh da página e nova batalha partem do estado salvo.
- **Estimativa:** M
- **Depende de:** T-1.2, T-1.3

### T-1.5 — Daily reward
- **Descrição:** Nova `DailyRewardScene.js` com UI de 7 dias rotativos. Ler `daily_rewards` e `daily_streaks` do Supabase. Ao clicar "Resgatar", inserir linha em `daily_rewards` com timestamp UTC e atualizar `daily_streaks`. RLS impede resgatar duas vezes no mesmo dia (constraint `unique(user_id, day_utc)`). Prêmios de cada dia definidos em `public/assets/daily_calendar.json`.
- **Arquivos:** novo `src/scenes/DailyRewardScene.js`, novo `public/assets/daily_calendar.json`.
- **Critério de done:** Resgatar duas vezes no mesmo dia: a segunda falha com erro do Supabase. Streak incrementa corretamente. Prêmio é creditado em `player_data`.
- **Estimativa:** M
- **Depende de:** T-1.4

---

## Fase 2 — Heróis, Itens e Equipamentos

**Objetivo:** introduzir inventário de heróis com troca de party, 6 slots de equipamento por personagem e bônus aplicados em runtime, tudo persistido no Supabase.

### T-2.0 — Separar roster de heróis da party ativa

- **Descrição:** Hoje `party_data` tem 3 slots fixos com o herói hardcoded. Adicionar `owned_heroes: []` ao `player_data` — lista de todos os heróis que o jogador possui, cada um com `hero_id`, `prefab_name`, `stats`, `experience`, `current_level` e `face`. Os 3 slots de `party_data` passam a referenciar `hero_id` em vez de embutir os dados. No `default_data.json`, pré-popular `owned_heroes` com `paladin` e `fireknight` (os dois heróis iniciais). Adicionar coluna `owned_heroes` (JSONB) na tabela `player_data` no Supabase.
- **Arquivos:** `public/assets/default_data.json`, `src/prefabs/playerData.js`, migration Supabase.
- **Critério de done:** `player_data.owned_heroes` tem os heróis iniciais; `party_data` referencia por `hero_id`; `GameScene.create()` resolve os heróis corretos a partir do roster.
- **Estimativa:** M
- **Depende de:** T-1.4

### T-2.0b — Catálogo de heróis disponíveis

- **Descrição:** Novo `public/assets/heroes/catalog.json` listando todos os heróis do jogo com `hero_id`, `prefab_name`, `name`, `face`, `stats_base`, `animations`. Fonte de verdade para stats iniciais ao desbloquear um herói novo. `GameScene` e `HeroRosterScene` carregam este arquivo.
- **Arquivos:** novo `public/assets/heroes/catalog.json`.
- **Critério de done:** Arquivo carregável via `this.load.json('heroes_catalog', ...)`; cada herói existente no jogo tem entrada.
- **Estimativa:** P
- **Depende de:** —

### T-2.0c — Tela de inventário de heróis (HeroRosterScene)

- **Descrição:** Nova cena `HeroRosterScene.js` acessível por botão na `GameScene` (ou botão fixo no HUD). Exibe todos os heróis em `owned_heroes` como cards com face, nome, level e stats resumidos. Os 3 slots de party ficam visíveis no topo. Arrastar (ou tocar) um herói para um slot o coloca na party; arrastar um herói já na party de volta à lista o remove. Herói em slot diferente de `empty` fica destacado. Confirmar fecha o painel e reinicia o combate com a nova composição via `GameScene.battle()`.
- **Arquivos:** novo `src/scenes/HeroRosterScene.js`, novo `src/prefabs/HUD/HeroCard.js`, novo `src/prefabs/HUD/PartySlot.js`.
- **Critério de done:** Trocar paladin pelo executor na party → próximo combate usa executor. Slot vazio (`empty`) é válido. Pelo menos 1 herói deve estar na party para confirmar.
- **Estimativa:** G
- **Depende de:** T-2.0, T-2.0b

### T-2.0d — Persistir composição da party no Supabase

- **Descrição:** Ao confirmar uma troca na `HeroRosterScene`, chamar `playerService.saveParty(userId, party_data)` para atualizar os slots no Supabase. Na próxima sessão, `GameScene.create()` carrega a party salva.
- **Arquivos:** `src/services/playerService.js`, `src/scenes/HeroRosterScene.js`.
- **Critério de done:** Fechar e reabrir o jogo mantém a mesma composição de party configurada.
- **Estimativa:** P
- **Depende de:** T-2.0c, T-1.4

---

### T-2.1 — Estender party_data com slots de equipamento
- **Descrição:** Adicionar `equipment: [null, null, null, null, null, null]` e `stats_bonus: {}` em cada entrada de `party_data` no `default_data.json` (referência offline) e no schema Supabase (coluna JSONB na tabela `parties`).
- **Arquivos:** `public/assets/default_data.json`, migration Supabase em `supabase/migrations/`.
- **Critério de done:** Estrutura existe no JSON e no Supabase; `PlayerData` carrega sem erro.
- **Estimativa:** P
- **Depende de:** T-1.4

### T-2.2 — Reescrever Equipment para aplicar bônus em runtime
- **Descrição:** `src/inventory/Equipment.js` hoje salva `stats_bonus[stat]` mas nunca soma ao stat efetivo. Implementar `apply_to(unit)` que soma os bônus em `unit.stats[stat]` e `remove_from(unit)` que devolve ao baseline. Garantir simetria.
- **Arquivos:** `src/inventory/Equipment.js`.
- **Critério de done:** Equipar item com `+5 attack` aumenta `unit.stats.attack` em 5; desequipar reverte.
- **Estimativa:** M
- **Depende de:** T-2.1

### T-2.3 — Catálogo de itens
- **Descrição:** Novo JSON com pelo menos 12 itens cobrindo: ataque, defesa, velocidade, lifesteal, crítico. Campos: `id`, `name`, `slot`, `stats_bonus: {}`, `description`.
- **Arquivos:** novo `public/assets/items/catalog.json`.
- **Critério de done:** Carregável via `this.load.json('items_catalog', 'assets/items/catalog.json')` na cena.
- **Estimativa:** P
- **Depende de:** —

### T-2.4 — UI de equipamento
- **Descrição:** Painel (overlay ou cena nova `EquipmentScene.js`) com 3 personagens × 6 slots. Clicar em slot abre lista de itens compatíveis no inventário. Tooltip mostra bônus. Ao confirmar equip/unequip, chama `Equipment.apply_to`/`remove_from` e persiste via T-2.6.
- **Arquivos:** novo `src/scenes/EquipmentScene.js`, novo `src/prefabs/HUD/EquipmentSlot.js`.
- **Critério de done:** Equipar/desequipar funciona pela UI e reflete em stats no próximo combate.
- **Estimativa:** G
- **Depende de:** T-2.2, T-2.3

### T-2.5 — Consolidar classes Item duplicadas
- **Descrição:** `src/inventory/Item.js` e `src/prefabs/items/Item.js` são quase idênticos. Manter `src/inventory/Item.js` como único arquivo e atualizar todos os imports.
- **Arquivos:** `src/inventory/Item.js`, `src/prefabs/items/Item.js` (remover), grep por imports.
- **Critério de done:** `npm run build` passa sem erros; sem imports quebrados.
- **Estimativa:** P
- **Depende de:** —

### T-2.6 — Persistir equipamento no Supabase
- **Descrição:** Após cada equip/unequip, `src/services/playerService.js` atualiza a coluna `equipment` do personagem correspondente na tabela `parties`.
- **Arquivos:** `src/services/playerService.js`, `src/scenes/EquipmentScene.js`.
- **Critério de done:** Refresh da página mantém os itens equipados.
- **Estimativa:** P
- **Depende de:** T-2.4, T-1.4

---

## Fase 3 — Social: Amigos e Chat

**Objetivo:** lista de amigos, presença online e chat (global + privado) via Supabase Realtime — sem backend próprio.

### T-3.1 — Serviço de amizades
- **Descrição:** Criar `src/services/friends.js` com funções: `sendRequest(toUserId)`, `acceptRequest(friendshipId)`, `declineRequest(friendshipId)`, `removeFriend(friendshipId)`, `listFriends()`. Tabela `friends` com estados `pending`/`accepted`. RLS: usuário vê apenas amizades onde é remetente ou destinatário.
- **Arquivos:** novo `src/services/friends.js`.
- **Critério de done:** Fluxo completo de pedido/aceite/recusa funciona via console.
- **Estimativa:** M
- **Depende de:** T-1.2

### T-3.2 — Chat global e DM via Supabase Realtime
- **Descrição:** Canal global: `supabase.channel('global').on('broadcast', { event: 'message' }, handler).subscribe()`. Canal privado: `dm:<userA_id>:<userB_id>` (ids ordenados para evitar canal duplicado). Mensagens persistidas na tabela `messages` antes de publicar via `broadcast`. Histórico carregado com `select` ao abrir o chat.
- **Arquivos:** novo `src/services/chat.js`.
- **Critério de done:** Dois browsers trocam mensagem em < 1 s; histórico aparece ao reabrir o chat.
- **Estimativa:** M
- **Depende de:** T-1.2

### T-3.3 — Presença online
- **Descrição:** Ao entrar no jogo, rastrear presença com `supabase.channel('presence').track({ user_id, status: 'online' })`. Listar amigos online filtrando o estado de presença pelos ids retornados por `listFriends()`.
- **Arquivos:** novo `src/services/presence.js`, `src/services/friends.js` (adicionar `getOnlineFriends()`).
- **Critério de done:** Fechar aba de um cliente → presença some em ≤ 10 s no outro.
- **Estimativa:** P
- **Depende de:** T-3.1, T-3.2

### T-3.4 — UI de chat e amigos
- **Descrição:** Overlay com 2 abas (Global / Amigos). Aba Amigos: lista com status online/offline, botão de pedido de amizade e botão de chat privado. Aba Global: chat de todos. Ícone piscando quando chega DM ou pedido de amizade com overlay fechado.
- **Arquivos:** novo `src/scenes/ChatScene.js` (ou overlay em GameScene), novo `src/prefabs/HUD/NotificationIcon.js`.
- **Critério de done:** Receber mensagem com overlay fechado → ícone pisca; abrir → para de piscar. Histórico carrega ao abrir.
- **Estimativa:** G
- **Depende de:** T-3.2, T-3.3

---

## Fase 4 — PvP e Ranking

**Objetivo:** PvP assíncrono entre amigos e ranking global via Supabase Postgres.

### T-4.1 — PvP assíncrono
- **Descrição:** Ao desafiar um amigo, salvar as stats atuais do partido do desafiador em `pvp_matches` (Supabase). O cliente do desafiado recebe o desafio via Supabase Realtime (canal `pvp_challenges:<userId>`), simula o combate localmente usando a mesma lógica de `GameScene` (PriorityQueue + PhysicalAttack), e grava `winner_id`, `log` e `played_at`. Os dados de input vêm do Supabase (não do adversário em trânsito), tornando a simulação não-forjável sem Edge Function.
- **Arquivos:** novo `src/services/pvp.js`, novo `src/scenes/PvpScene.js`.
- **Critério de done:** Dois browsers: desafiador convida, desafiado vê notificação, aceita, resultado aparece para os dois. `pvp_matches` tem registro com `winner_id`.
- **Estimativa:** G
- **Depende de:** T-3.1, T-1.4

### T-4.2 — Ranking via Supabase
- **Descrição:** View `pvp_ranking` no Supabase agrupando vitórias por `winner_id` (`ORDER BY wins DESC LIMIT 100`). Criar `src/services/ranking.js` com `fetchPvpRanking()` e `fetchPlayerRank(userId)`.
- **Arquivos:** novo `src/services/ranking.js`, migration com view em `supabase/migrations/`.
- **Critério de done:** Query retorna top 100 com nome e vitórias; posição do jogador logado é destacável.
- **Estimativa:** P
- **Depende de:** T-4.1

### T-4.3 — UI de PvP e Ranking
- **Descrição:** `PvpScene.js` com lista de amigos para desafiar, resultado animado da batalha e histórico de matches. `RankingScene.js` com top 100 e posição do jogador destacada. Refresh automático a cada 30 s.
- **Arquivos:** `src/scenes/PvpScene.js`, novo `src/scenes/RankingScene.js`.
- **Critério de done:** Telas funcionais em 320×630; ranking atualiza sem reload completo.
- **Estimativa:** M
- **Depende de:** T-4.1, T-4.2

---

## 4. Deploy

- `npm run build` gera `dist/` via Vite.
- Publicar em **Cloudflare Pages** com deploy automático via GitHub.
- Variáveis de ambiente no painel Cloudflare Pages: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

---

## 5. Backlog (fora do escopo agora)

- Refator do TODO em `src/prefabs/Unit/EnemyUnit.js:41-44` (limpeza de prefab no destroy).
- OAuth (Google / GitHub).
- Som e música.
- Internacionalização (i18n).
- Anti-cheat via Supabase Edge Functions.

## 6. Verificação fim-a-fim por fase

| Fase | Como testar |
|---|---|
| 1 | `npm run dev` → registrar, logar, vencer combate, fechar aba, reabrir — estado preservado no Supabase. Daily reward bloqueia segunda tentativa no mesmo dia. |
| 2 | `npm run dev` → abrir HeroRosterScene, trocar herói da party, confirmar → próximo combate usa o novo herói. Abrir UI de equipamento, equipar item, ver stat mudar. Refresh mantém party e equipamento. |
| 3 | Dois browsers logados: trocar mensagens em < 1 s; fechar 1 aba → presença some em ≤ 10 s no outro. |
| 4 | Dois browsers: desafio PvP aceito, resultado gravado no Supabase, ranking atualiza. |
