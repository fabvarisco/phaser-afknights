# Documentação de Tarefas — AFKnights

> Plano de execução das mudanças descritas em `doc/requisitos.md`. Última atualização: 2026-06-07.

## 1. Visão geral das fases

```
Fase 1: Refator combate idle
        └── RF-01, RF-02
             │
             ▼
Fase 2: Itens e atributos
        └── RF-06
             │
             ▼
Fase 3: Backend + Redis + login + persistência + daily
        └── RF-09, RF-11, RF-05, RNF-01..06
             │
             ├──────────────┐
             ▼              ▼
        Fase 4:         Fase 5:
        Social/Chat     PvP / Bosses / Ranking
        RF-03           RF-04, RF-07, RF-08, RF-10
             │              │
             └──────┬───────┘
                    ▼
        Fase 6: Observabilidade e Deploy
                └── RNF-07, RNF-08
```

Fases 4 e 5 podem ser paralelizadas após a Fase 3. A Fase 6 (observabilidade e deploy em produção) pode rodar em paralelo a partir do meio da Fase 3 — adiciona Sentry, Pino, Prometheus, Grafana, Cloudflare e o pipeline Docker → Railway.

## 2. Convenções

- **Branch:** `feat/fase-<N>-<slug-curto>` (ex: `feat/fase-1-idle-combat`).
- **Commit:** prefixo `[F<N>]` (ex: `[F1] remove HP/MP do PlayerUnit`).
- **Rodar frontend:** `npm run dev` na raiz.
- **Rodar backend (a partir da Fase 3):** `cd server && npm run start:dev`.
- **Rodar Redis local (a partir da Fase 3):** `docker compose up redis` (config em `docker-compose.yml` na raiz).
- **Lint:** `npx eslint src` (sem script `lint` definido em `package.json`).
- **Variáveis de ambiente:** `.env` no `server/` (Supabase URL/keys, `REDIS_URL`, `SENTRY_DSN`); `.env.local` no frontend (`VITE_API_URL`, `VITE_SUPABASE_URL`).

## 3. Template de tarefa

```
T-XX.YY — Título
- RF relacionado
- Descrição
- Arquivos
- Critério de done
- Estimativa: P (≤ 2h) / M (≤ 1 dia) / G (> 1 dia)
- Depende de
```

---

## Fase 1 — Refator do Combate para Idle

**Objetivo:** transformar `GameScene` em loop idle, remover HP/MP do jogador, introduzir status effects e fazer inimigos aplicarem debuffs.

### T-1.1 — Remover HP/MP do PlayerUnit
- **RF:** RF-01
- **Descrição:** PlayerUnit não usa mais `stats.health`, `max_health`, `mana`. Sobrescreve ou ignora `receive_damage()` herdado de `Unit.js`. Remover blocos de HP/MP do `default_data.json` para `party_data`.
- **Arquivos:** `src/prefabs/Unit/PlayerUnit.js`, `src/prefabs/Unit/Unit.js` (linhas 52-62), `public/assets/default_data.json` (linhas 7-14 e equivalentes em party2/party3).
- **Critério de done:** PlayerUnit ainda renderiza e anima, mas não tem barra de vida nem pode morrer.
- **Estimativa:** P
- **Depende de:** —

### T-1.2 — Desacoplar turno da animação
- **RF:** RF-01
- **Descrição:** Hoje `Unit.back_to_idle()` (linha 45-50) chama `scene.nextTurn()` quando a animação de attack1/attack2 termina. Remover essa dependência e introduzir um tick de tempo via `scene.time.addEvent` por unidade.
- **Arquivos:** `src/prefabs/Unit/Unit.js` (linhas 39-50), `src/scenes/GameScene.js`.
- **Critério de done:** Combate avança no tempo mesmo com animações desativadas; nenhuma chamada a `nextTurn()` dentro de `back_to_idle`.
- **Estimativa:** M
- **Depende de:** T-1.1

### T-1.3 — Loop de combate idle por timer
- **RF:** RF-01
- **Descrição:** Substituir o `PriorityQueue` (GameScene.js linhas 196-213) por **um timer por unidade**. Intervalo = `Math.ceil(1000 / stats.speed)` ms. Inimigo tem um timer de "aplicar debuff" independente.
- **Arquivos:** `src/scenes/GameScene.js` (linhas 101-125, 196-213), remover import `js-priority-queue`.
- **Critério de done:** Personagens atacam em intervalos previsíveis; remover `units.queue/dequeue` do código.
- **Estimativa:** M
- **Depende de:** T-1.2

### T-1.4 — Limpar menus de ação manuais
- **RF:** RF-01
- **Descrição:** Os menus de Physical/Magical attack, Inventory, EnemyMenu e Back não fazem sentido no idle. Remover do `game_scene.json` e dos `prefab_classes`. Manter Autobattle como botão de pausa/play opcional.
- **Arquivos:** `src/prefabs/HUD/PhysicalAttackMenuItem.js`, `MagicalAttackMenuItem.js`, `InventoryMenuItem.js`, `EnemyMenuItem.js`, `backMenuItem.js`, `Menu.js` (linhas 16-53), `src/scenes/GameScene.js` (prefab_classes linhas 25-39), `public/assets/levels/game_scene.json`.
- **Critério de done:** Combate roda sem nenhum botão. Botão pausa/play (renomeado do Autobattle) ainda funciona.
- **Estimativa:** M
- **Depende de:** T-1.3

### T-1.5 — Sistema de status effects
- **RF:** RF-02
- **Descrição:** Novo módulo com classe `StatusEffect` (`type`, `magnitude`, `duration_ticks`). Tipos iniciais: `slow`, `attack_down`, `defense_down`, `stun`. Cada unit ganha `active_effects: []`. `apply_effect(effect)` e `tick_effects()` (chamado a cada tick do timer).
- **Arquivos:** novo `src/prefabs/combat/StatusEffect.js`, `src/prefabs/Unit/Unit.js`.
- **Critério de done:** É possível aplicar manualmente via console um `slow(2, 5)` em uma unit e ver `stats.speed` cair por 5 ticks.
- **Estimativa:** M
- **Depende de:** T-1.3

### T-1.6 — EnemyUnit aplica debuffs em vez de atacar
- **RF:** RF-02
- **Descrição:** `EnemyUnit.act()` (linhas 32-36) escolhe alvo aleatório e chama `target.apply_effect(<debuff aleatório>)`. Sem mais `attack.hit()`.
- **Arquivos:** `src/prefabs/Unit/EnemyUnit.js`.
- **Critério de done:** Inimigo nunca causa dano; aplica debuff visível a cada tick dele.
- **Estimativa:** P
- **Depende de:** T-1.5

### T-1.7 — HUD: trocar HP/MP por ícones de debuff
- **RF:** RF-02
- **Descrição:** `ShowPlayerUnit.js` (linhas 36-71) hoje renderiza HP/MP. Substituir por ícones dos efeitos ativos sobre cada party member. Layout hardcoded (linhas 42-52: `x + 130`, `y + 80 * index`) extraído para constante no topo do arquivo.
- **Arquivos:** `src/prefabs/HUD/ShowPlayerUnit.js`.
- **Critério de done:** Não há mais barras de HP/MP do jogador na tela; ícones aparecem/desaparecem conforme efeitos entram/saem.
- **Estimativa:** M
- **Depende de:** T-1.5

### T-1.8 — Teste manual da Fase 1
- **RF:** RF-01, RF-02
- **Descrição:** Roteiro de validação: rodar `npm run dev`, observar 30s de combate.
- **Critério de done:**
  - [ ] Personagens atacam sozinhos.
  - [ ] Inimigo aplica pelo menos 2 debuffs distintos.
  - [ ] Vitória dispara quando HP do último inimigo zera.
  - [ ] Nenhum erro no console.
- **Estimativa:** P
- **Depende de:** T-1.1..T-1.7

---

## Fase 2 — Sistema de Itens e Atributos

**Objetivo:** introduzir 6 slots de equipamento por personagem, com bônus realmente aplicados.

### T-2.1 — Estender `party_data` com slots de equipamento
- **RF:** RF-06
- **Descrição:** Adicionar `equipment: [null, null, null, null, null, null]` e `stats_bonus: {}` em cada entrada de `party_data` no `default_data.json`.
- **Arquivos:** `public/assets/default_data.json`.
- **Critério de done:** Estrutura existe e é carregada por `PlayerData` (`src/prefabs/playerData.js:8`).
- **Estimativa:** P
- **Depende de:** —

### T-2.2 — Reescrever `Equipment` para aplicar bônus em runtime
- **RF:** RF-06
- **Descrição:** Hoje `src/inventory/Equipment.js:32` salva `stats_bonus[stat] = bonus` mas nunca soma ao stat efetivo. Implementar `apply_to(unit)` e `remove_from(unit)` que mutam `unit.stats[stat]`. Garantir simetria (remover devolve ao baseline).
- **Arquivos:** `src/inventory/Equipment.js`.
- **Critério de done:** Equipar item com `+5 ataque` aumenta `unit.stats.attack` em 5; desequipar volta.
- **Estimativa:** M
- **Depende de:** T-2.1

### T-2.3 — Catálogo de itens
- **RF:** RF-06
- **Descrição:** Novo JSON com pelo menos 12 itens cobrindo atributos: ataque, defesa, velocidade, lifesteal, crítico, defesa contra debuff.
- **Arquivos:** novo `public/assets/items/catalog.json`.
- **Critério de done:** Carregável via `this.load.json('items_catalog', '...')` na cena.
- **Estimativa:** P
- **Depende de:** —

### T-2.4 — UI de equipamento
- **RF:** RF-06
- **Descrição:** Painel (overlay ou cena nova) que mostra 3 personagens × 6 slots. Clicar em slot abre lista de itens compatíveis no inventário. Tooltip mostra bônus.
- **Arquivos:** novo `src/scenes/EquipmentScene.js` (ou overlay em GameScene), novo `src/prefabs/HUD/EquipmentSlot.js`, ajustes em `src/inventory/Inventory.js`.
- **Critério de done:** Equipar/desequipar funciona pela UI e reflete em stats no próximo tick.
- **Estimativa:** G
- **Depende de:** T-2.2, T-2.3

### T-2.5 — Consolidar classes `Item` duplicadas
- **RF:** RF-06
- **Descrição:** `src/inventory/Item.js` e `src/prefabs/items/Item.js` são quase idênticos (confirmado na exploração). Manter um único arquivo (`src/inventory/Item.js`) e atualizar imports.
- **Arquivos:** `src/inventory/Item.js`, `src/prefabs/items/Item.js` (deletar), grep por imports.
- **Critério de done:** Build (`npm run build`) passa sem erros, sem imports quebrados.
- **Estimativa:** P
- **Depende de:** —

### T-2.6 — Persistir estado de equipamento local
- **RF:** RF-06
- **Descrição:** `Inventory` salva itens equipados em `cache.game.player_data.party_data[N].equipment`. Preparar formato pra Fase 3 sincronizar.
- **Arquivos:** `src/inventory/Inventory.js`.
- **Critério de done:** Refresh da página... ainda perde estado (esperado nesta fase — corrigido na Fase 3); mas o formato em memória já está pronto.
- **Estimativa:** P
- **Depende de:** T-2.4

---

## Fase 3 — Backend, Redis, Login, Persistência e Daily Rewards

**Objetivo:** subir backend NestJS + Redis + filas BullMQ, login Supabase, sincronizar `player_data`, implementar recompensas diárias e deixar a edge (Cloudflare) preparada.

### T-3.1 — Bootstrap do backend NestJS
- **RF:** RNF-01
- **Descrição:** Criar `server/` com NestJS, TypeScript, ESLint. `npm run start:dev` precisa servir em `http://localhost:3000`. Habilitar global pipes (`ValidationPipe` com `class-validator`).
- **Arquivos:** novo `server/` (package.json, tsconfig, src/main.ts, src/app.module.ts).
- **Critério de done:** `GET http://localhost:3000` responde 200; DTO inválido retorna 400.
- **Estimativa:** M
- **Depende de:** —

### T-3.2 — Provisionar Supabase + schema inicial
- **RF:** RNF-01, RF-11
- **Descrição:** Criar projeto Supabase. Definir tabelas: `users` (gerenciada pelo Auth), `player_data`, `parties`, `inventory`, `equipment`, `friends`, `messages`, `pvp_matches`, `boss_damage`, `boss_instances`, `raid_rooms`, `daily_rewards`, `daily_streaks`. Migrations via Supabase CLI em `server/supabase/migrations/`. Configurar bucket `Storage` para `sprites/` e `save-exports/`.
- **Arquivos:** `server/supabase/migrations/*.sql`.
- **Critério de done:** `supabase db reset` recria o schema do zero; bucket Storage acessível com policy correta.
- **Estimativa:** G
- **Depende de:** T-3.1

### T-3.2b — Provisionar Redis + BullMQ
- **RF:** RNF-01, RNF-05
- **Descrição:** Adicionar `docker-compose.yml` na raiz com serviço Redis 7+. Configurar `@nestjs/bullmq` no `server/`. Criar `RedisModule` central exportando o client (`ioredis`). Configurar Socket.io Redis adapter no `main.ts` para suportar múltiplas réplicas.
- **Arquivos:** novo `docker-compose.yml`, `server/src/redis/redis.module.ts`, `server/src/main.ts`.
- **Critério de done:** `docker compose up redis` sobe Redis local; backend conecta e responde a `PING`.
- **Estimativa:** M
- **Depende de:** T-3.1

### T-3.2c — Throttle guard global
- **RF:** RNF-04
- **Descrição:** Instalar `@nestjs/throttler`. Configurar limite default global (ex: 60 req/min por IP) e overrides por endpoint sensível (login: 5/min; world-boss/attack: 10/min por usuário).
- **Arquivos:** `server/src/app.module.ts`, decorators `@Throttle` nos controllers.
- **Critério de done:** Sexta requisição em 1 min para `/auth/login` retorna 429.
- **Estimativa:** P
- **Depende de:** T-3.1

### T-3.3 — Módulo `auth` (login/registro)
- **RF:** RF-09
- **Descrição:** Endpoints `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`. Valida via Supabase Auth, retorna JWT. Guard `AuthGuard` (verifica JWT do Supabase via `@supabase/supabase-js`) para rotas protegidas.
- **Arquivos:** `server/src/auth/*`.
- **Critério de done:** É possível registrar, logar, e acessar rota protegida com `Authorization: Bearer <jwt>`. JWT inválido retorna 401.
- **Estimativa:** M
- **Depende de:** T-3.2

### T-3.4 — Frontend: tela de login real
- **RF:** RF-09
- **Descrição:** Substituir `TitleScene.login()` (linhas 37-40, hoje só cria `PlayerData` em memória) por tela com formulário (input HTML overlay ou phaser3-rex-plugins TextEdit). JWT vai pro `localStorage`. Refresh recupera sessão.
- **Arquivos:** `src/scenes/TitleScene.js`, novo `src/services/auth.js`.
- **Critério de done:** Refresh com sessão ativa pula direto pro GameScene.
- **Estimativa:** M
- **Depende de:** T-3.3, T-3.6

### T-3.5 — Módulo `player` no backend
- **RF:** RF-11
- **Descrição:** Endpoints `GET /me` (devolve `player_data` completo), `PATCH /me/party`, `PATCH /me/inventory`, `PATCH /me/equipment`, `POST /me/rewards` (chamado por `GameScene.rewards()`).
- **Arquivos:** `server/src/player/*`.
- **Critério de done:** Distribuir recompensas no GameScene persiste no Supabase; refresh devolve o mesmo estado.
- **Estimativa:** G
- **Depende de:** T-3.2, T-3.3

### T-3.6 — Cliente HTTP no frontend
- **RF:** RF-11
- **Descrição:** Novo `src/services/api.js` com wrapper de fetch que injeta o JWT do `localStorage` em todo request e trata 401 (logout).
- **Arquivos:** novo `src/services/api.js`.
- **Critério de done:** `api.get('/me')` funciona após login.
- **Estimativa:** P
- **Depende de:** —

### T-3.7 — Substituir Firebase comentado por API real
- **RF:** RF-11
- **Descrição:** A linha comentada em `src/scenes/GameScene.js:186` (`firebase.database().ref(...).set(...)`) vira `api.post('/me/rewards', payload).then(() => this.battle())`.
- **Arquivos:** `src/scenes/GameScene.js` (linha 146-188, função `rewards`).
- **Critério de done:** Recompensa só dispara `battle()` após resposta 200 da API.
- **Estimativa:** P
- **Depende de:** T-3.5, T-3.6

### T-3.8 — Módulo `RewardsModule` (daily rewards)
- **RF:** RF-05
- **Descrição:** Endpoints `GET /daily/status` (retorna se pode resgatar, qual dia da streak), `POST /daily/claim` (resgata). Calendário de 7 dias rotativo definido em `server/src/rewards/calendar.ts`. Janela de 24 h em UTC. **Job recorrente `daily-reward-cron` no BullMQ** roda a cada hora para detectar streaks expiradas e disparar notificações.
- **Arquivos:** `server/src/rewards/*` (controller, service, processor BullMQ), schema `daily_rewards`, `daily_streaks`.
- **Critério de done:** Dois `POST /daily/claim` consecutivos no mesmo dia: o segundo retorna 409. Job `daily-reward-cron` aparece no painel BullMQ.
- **Estimativa:** M
- **Depende de:** T-3.2, T-3.2b

### T-3.9 — UI de daily reward
- **RF:** RF-05
- **Descrição:** Tela mostrando 7 dias, dia atual destacado, botão "Resgatar" habilitado/desabilitado conforme `/daily/status`.
- **Arquivos:** novo `src/scenes/DailyRewardScene.js`.
- **Critério de done:** Resgatar mostra animação, atualiza ouro/itens, botão desabilita até o próximo dia.
- **Estimativa:** M
- **Depende de:** T-3.8

### T-3.10 — Teste manual da Fase 3
- **RF:** RF-09, RF-11, RF-05
- **Critério de done:**
  - [ ] Registrar, logar, fechar aba, reabrir — estado preservado.
  - [ ] Vencer combate persiste recompensa no Supabase.
  - [ ] Resgatar daily duas vezes no mesmo dia — segunda falha.

---

## Fase 4 — Social: Amigos e Chat

**Objetivo:** lista de amigos, presença online, chat global e privado.

### T-4.1 — Módulo `social` no backend
- **RF:** RF-03
- **Descrição:** Endpoints `GET /friends`, `POST /friends/request`, `POST /friends/accept`, `POST /friends/decline`, `DELETE /friends/:id`. Schema `friends` com estado (`pending`, `accepted`).
- **Arquivos:** `server/src/social/*`.
- **Critério de done:** Fluxo de pedido/aceite testado via Postman.
- **Estimativa:** M
- **Depende de:** T-3.3

### T-4.2 — `ChatModule` com Socket.io + Supabase Realtime
- **RF:** RF-03
- **Descrição:** Canais Socket.io: `global` e `dm:<userA>:<userB>` (ordenados por id pra evitar canal duplicado). Persistir cada mensagem em `messages` (Postgres). **Presença online (lista de amigos) usa Supabase Realtime Presence** — frontend subscreve direto via cliente Supabase, sem passar pelo NestJS. NestJS apenas valida sessão.
- **Arquivos:** `server/src/chat/*`, `src/services/presence.js` (frontend usa `supabase-js`).
- **Critério de done:** Dois clientes conectados trocam mensagem em < 500 ms; presença atualiza em ≤ 5 s.
- **Estimativa:** G
- **Depende de:** T-3.3, T-3.2b

### T-4.3 — UI de chat e amigos
- **RF:** RF-03
- **Descrição:** Overlay com 2 abas (global / amigos). Aba amigos: lista de amigos online/offline com botão de chat privado. Aba global: chat de todos.
- **Arquivos:** novo `src/scenes/ChatScene.js` (ou overlay em GameScene), `src/services/chat.js` (socket.io-client).
- **Critério de done:** Histórico carrega ao abrir; novas mensagens aparecem em tempo real.
- **Estimativa:** G
- **Depende de:** T-4.1, T-4.2

### T-4.4 — Notificações in-game
- **RF:** RF-03
- **Descrição:** Toast/ícone piscando quando chega DM ou pedido de amizade enquanto a aba não está aberta.
- **Arquivos:** `src/scenes/ChatScene.js`, `src/prefabs/HUD/NotificationIcon.js` (novo).
- **Critério de done:** Receber mensagem com aba fechada → ícone pisca; abrir → para de piscar.
- **Estimativa:** M
- **Depende de:** T-4.3

---

## Fase 5 — PvP, Bosses e Ranking

**Objetivo:** combate PvP autoritativo, world boss compartilhado, raid boss cooperativo, ranking global.

### T-5.1 — `CombatModule` (motor de combate idle no backend)
- **RF:** RF-04, RF-07, RF-08
- **Descrição:** Portar a lógica de tick/debuff da Fase 1 para TypeScript dentro de `server/src/combat/`. Funções puras: `tick(state) → newState`. Sem dependência de Phaser. Estado quente de batalhas ativas vive em Redis (`battle:<id>` → JSON serializado), persistido em Postgres no fim.
- **Arquivos:** `server/src/combat/*`.
- **Critério de done:** Testes unitários de tick passam (`npm test` no server); batalha reentrante (kill/restart do processo) é recuperada do Redis.
- **Estimativa:** G
- **Depende de:** Fase 1 estável, T-3.2b

### T-5.2 — `PvPModule` com matchmaking BullMQ
- **RF:** RF-04
- **Descrição:** Endpoints + gateway: `POST /pvp/queue` (joga jogador na `matchmaking-queue` do BullMQ), `POST /pvp/challenge/:friendId` (cria match direto), gateway `pvp:<matchId>` emitindo ticks. **Worker da `matchmaking-queue`** pareia jogadores por MMR e cria o match no Redis. Resultado final grava em `pvp_matches` (Postgres).
- **Arquivos:** `server/src/pvp/*` (controller, gateway, processor BullMQ).
- **Critério de done:** Dois clientes em browsers diferentes entram na fila e batalham; tempo médio de pareamento < 5 s com fila cheia.
- **Estimativa:** G
- **Depende de:** T-5.1, T-3.2b

### T-5.3 — UI de PvP
- **RF:** RF-04
- **Descrição:** Tela de fila + tela de batalha replicando o visual do GameScene (mas spectator-only — não envia inputs).
- **Arquivos:** novo `src/scenes/PvpQueueScene.js`, `src/scenes/PvpBattleScene.js`.
- **Critério de done:** Cliente assiste batalha sincronizada com o tick do servidor.
- **Estimativa:** G
- **Depende de:** T-5.2

### T-5.4 — `BossModule` (parte World Boss)
- **RF:** RF-07
- **Descrição:** Job recorrente BullMQ `world-boss-cron` cria nova instância a cada N horas. Endpoint `POST /world-boss/attack` (validado server-side: dano calculado pelo backend baseado em stats persistidos). **HP global do boss em Redis** (`world-boss:<id>:hp` com `DECRBY` atômico). Dano por jogador acumulado em Redis Sorted Set (`world-boss:<id>:damage`). Ao fechar janela: worker da `loot-drop-queue` distribui recompensa, persiste em Postgres (`boss_damage`).
- **Arquivos:** `server/src/boss/world-boss.*`, processors BullMQ.
- **Critério de done:** 10 jogadores batendo no mesmo boss: HP único decrementa de forma atômica; dano por jogador é correto; loot é distribuído via fila sem perda em caso de crash.
- **Estimativa:** G
- **Depende de:** T-5.1, T-3.2b

### T-5.5 — `BossModule` (parte Raid Boss)
- **RF:** RF-08
- **Descrição:** Lobby (`POST /raid/create`, `POST /raid/join/:roomId`, gateway `raid:<roomId>`). Estado da sala em Redis (`raid:<roomId>` → JSON com membros, HP, expiração via TTL). Inicia combate quando líder dá start. Janela de tempo controlada pelo TTL do Redis. Recompensa via `loot-drop-queue` se boss morre dentro do tempo.
- **Arquivos:** `server/src/boss/raid-boss.*`.
- **Critério de done:** 4 clientes criam sala, matam boss, todos recebem recompensa. Sala expira sozinha se ninguém matar.
- **Estimativa:** G
- **Depende de:** T-5.1, T-4.1, T-3.2b

### T-5.6 — UI de bosses
- **RF:** RF-07, RF-08
- **Descrição:** Cena de world boss (botão "atacar" + HP global + ranking momentâneo). Cena de raid (lobby + sala + combate). Reaproveita componentes da Fase 1.
- **Arquivos:** novo `src/scenes/WorldBossScene.js`, `src/scenes/RaidLobbyScene.js`, `src/scenes/RaidBattleScene.js`.
- **Critério de done:** Telas funcionais e responsivas em 320×630.
- **Estimativa:** G
- **Depende de:** T-5.4, T-5.5

### T-5.7 — `RankModule` (ranking via Redis Sorted Sets)
- **RF:** RF-10
- **Descrição:** Endpoints `GET /ranking/pvp?limit=100`, `GET /ranking/world-boss?instanceId=…`, `GET /ranking/raid`. **Leaderboards em Redis Sorted Sets** — `ZADD ranking:pvp <wins> <userId>` em cada vitória; `ZREVRANGE 0 99 WITHSCORES` para top 100; `ZREVRANK` para posição do jogador. Postgres é backup de longo prazo (job semanal de snapshot).
- **Arquivos:** `server/src/rank/*`, hooks nos módulos PvP e Boss para `ZADD` em cada evento.
- **Critério de done:** Queries respondem em ≤ 50 ms com 10k registros (Redis); ranking sobrevive a restart do backend (TTL infinito nos sets).
- **Estimativa:** M
- **Depende de:** T-5.2, T-5.4, T-5.5

### T-5.8 — UI de ranking
- **RF:** RF-10
- **Descrição:** Cena `RankingScene` com 3 abas (PvP / World Boss / Raid). Refresh automático a cada 30 s.
- **Arquivos:** novo `src/scenes/RankingScene.js`.
- **Critério de done:** Top 100 visível, posição do jogador destacada.
- **Estimativa:** M
- **Depende de:** T-5.7

---

## Fase 6 — Observabilidade e Deploy

**Objetivo:** instrumentar backend e frontend com Sentry + Pino + Prometheus/Grafana, empacotar com Docker, publicar no Railway e servir o cliente via Cloudflare. Pode começar em paralelo a partir do meio da Fase 3.

### T-6.1 — Sentry (backend e frontend)
- **RF:** RNF-07
- **Descrição:** Instalar `@sentry/node` no `server/` e `@sentry/browser` no cliente. Capturar exceções não tratadas, anexar `userId` no scope. Configurar alertas básicos (erro > 1%/min) no dashboard Sentry.
- **Arquivos:** `server/src/main.ts`, `src/index.js`.
- **Critério de done:** Forçar um throw em rota de teste aparece no Sentry com stack trace e contexto do usuário.
- **Estimativa:** M
- **Depende de:** T-3.1

### T-6.2 — Pino logger no backend
- **RF:** RNF-07
- **Descrição:** Substituir o logger default do NestJS por `nestjs-pino`. Logs em JSON, nível por módulo (configurável via `LOG_LEVEL`). Cada request HTTP/WS gera um log com `requestId`.
- **Arquivos:** `server/src/app.module.ts`, `server/src/main.ts`.
- **Critério de done:** Logs saem em formato JSON estruturado; `LOG_LEVEL=debug` revela detalhes; `requestId` aparece em todas as linhas de um mesmo request.
- **Estimativa:** P
- **Depende de:** T-3.1

### T-6.3 — Métricas Prometheus + dashboards Grafana
- **RF:** RNF-07
- **Descrição:** Adicionar `@willsoto/nestjs-prometheus`. Expor `/metrics`. Métricas mínimas: `combat_tick_latency_ms`, `pvp_matches_active`, `world_boss_attacks_total`, `chat_messages_per_sec`, `bullmq_queue_depth{queue=...}`, `http_request_duration_seconds`. Configurar Grafana com 3 dashboards: Combate, Filas, Tráfego.
- **Arquivos:** `server/src/metrics/*`, dashboards versionados em `server/grafana/*.json`.
- **Critério de done:** `curl /metrics` retorna métricas Prometheus; dashboards Grafana populam com dados de carga sintética.
- **Estimativa:** G
- **Depende de:** T-3.1, T-5.1

### T-6.4 — Dockerfile do backend
- **RF:** RNF-08
- **Descrição:** `Dockerfile` multi-stage em `server/` (builder com deps de dev, runtime com `node:20-alpine` e apenas deps de prod). `docker-compose.yml` da raiz com `nestjs`, `redis`. Build local com `docker compose up --build`.
- **Arquivos:** novo `server/Dockerfile`, ajustes em `docker-compose.yml`.
- **Critério de done:** `docker compose up --build` sobe stack local funcional acessível em `http://localhost:3000`.
- **Estimativa:** M
- **Depende de:** T-3.2b

### T-6.5 — Deploy backend no Railway
- **RF:** RNF-08
- **Descrição:** Criar projeto Railway com 2 serviços: `backend` (Dockerfile do `server/`) e `redis` (template Railway). Variáveis de ambiente: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `REDIS_URL`, `SENTRY_DSN`. Healthcheck em `/health`. Deploy automático no push para `main`.
- **Arquivos:** `railway.json` (config opcional), README com instruções.
- **Critério de done:** Push em `main` derruba e sobe a versão nova em < 3 min; healthcheck verde.
- **Estimativa:** M
- **Depende de:** T-6.4

### T-6.6 — Frontend no Cloudflare
- **RF:** RNF-08, RNF-06
- **Descrição:** `npm run build` no frontend gera `dist/`. Publicar em Cloudflare Pages (deploy automático via GitHub). Configurar custom domain e regras de cache (assets versionados com hash imutáveis = `max-age=31536000`).
- **Arquivos:** sem alteração de código; configuração no painel Cloudflare.
- **Critério de done:** Cliente acessível em `https://afknights.example.com`; assets servidos com cache hit ratio > 90%.
- **Estimativa:** M
- **Depende de:** T-6.5

### T-6.7 — CI/CD pipeline
- **RF:** RNF-08
- **Descrição:** GitHub Actions: workflow rodando em PR (lint + testes + build Docker). Workflow em `main`: tag de imagem + deploy Railway + invalidação de cache Cloudflare.
- **Arquivos:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`.
- **Critério de done:** PR mostra check verde com lint+testes; merge em `main` dispara deploy completo (backend + frontend).
- **Estimativa:** M
- **Depende de:** T-6.5, T-6.6

### T-6.8 — Teste de carga sintético
- **RF:** RNF-02, RNF-05
- **Descrição:** Script com `k6` ou `artillery` simulando 200 jogadores no world boss + 50 mensagens/s no chat global. Validar SLOs (tick ≤ 250 ms, chat ≤ 500 ms p95).
- **Arquivos:** `server/load-tests/*.js`.
- **Critério de done:** Relatório do k6 mostra p95 dentro dos limites; nenhum erro 5xx; queue depth do BullMQ volta a zero em < 30 s após teste.
- **Estimativa:** G
- **Depende de:** T-5.4, T-6.3

---

## 4. Backlog (fora do escopo agora)

- Refator do TODO em `src/prefabs/Unit/EnemyUnit.js:41-44` (limpeza de prefab no destroy).
- Unificar `scene.current_unit` / `scene.current_attack` (globals de cena) — tornará obsoleto após a Fase 1.
- Anti-cheat avançado (rate limiting por usuário, detecção de patterns).
- OAuth (Google / GitHub) — extensão do RF-09.
- Som e música.
- Internacionalização (i18n).

## 5. Verificação fim-a-fim por fase

| Fase | Como testar |
|---|---|
| 1 | `npm run dev` → combate roda sozinho, inimigo aplica debuff, vitória ao zerar HP do inimigo. |
| 2 | `npm run dev` → abrir UI de equipamento, equipar item, ver stat do personagem mudar. |
| 3 | `docker compose up redis` + `npm run start:dev` (server) + `npm run dev` (cliente). Registrar → logar → recompensa persiste. Daily só uma vez. `/health` 200. `/metrics` (preview) responde. |
| 4 | Dois browsers logados trocam mensagens; presença (Supabase Realtime) atualiza em ≤ 5 s ao fechar 1. |
| 5 | Dois browsers fazem PvP via `matchmaking-queue`. 3+ browsers atacam world boss; HP global decrementa em Redis. Sala de raid com 4 jogadores mata boss. Ranking atualiza no Sorted Set. |
| 6 | Forçar exception → aparece no Sentry. `LOG_LEVEL=debug` mostra requestId nos logs Pino. `curl /metrics` retorna métricas. Push em `main` → deploy automático no Railway. Frontend acessível pelo Cloudflare. k6 200-usuário roda sem erros 5xx. |
