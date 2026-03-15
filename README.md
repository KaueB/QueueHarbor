# ⚓ QueueHarbor

**QueueHarbor** é um gateway de roteamento e observabilidade para filas assíncronas (BullMQ + Redis), projetado para resolver problemas de escalabilidade em ecossistemas *multi-tenant* de alta volumetria, acompanhado de um módulo de autenticação *Enterprise-grade* construído do zero.

## 🎯 O Desafio Arquitetural: *Asymmetric Load* e *Noisy Neighbor*

Em ecossistemas de e-commerce e integrações via ERP, a ingestão de *webhooks* vindos de múltiplos provedores externos gera um perfil de carga altamente assimétrico. 

Em uma arquitetura padrão onde múltiplos *tenants* ou integrações compartilham o mesmo *message broker* (Pool), ocorre o antipadrão do **"Vizinho Barulhento" (Noisy Neighbor)**. Quando um único provedor externo atua com uma volumetria desproporcional (disparando milhares de requisições por minuto), ele satura a fila de processamento. Isso causa *resource starvation* (inanição de recursos), poluindo a fila e penalizando a latência de integrações críticas ou de clientes menores que estão no mesmo pool.

## 🛠️ A Evolução da Infraestrutura

A mitigação inicial para esse gargalo em ambiente de produção exigiu **isolamento físico**: a infraestrutura foi fragmentada, subindo múltiplas instâncias dedicadas do Redis e segregando os *workers* do BullMQ para garantir *throughput* isolado para integrações de alto volume. 

Embora o isolamento resolva a concorrência de CPU e memória, ele destrói a **observabilidade**. Monitorar a saúde das filas e o processamento de *background jobs* espalhados em instâncias independentes torna-se um gargalo operacional complexo.

## 🚀 O Propósito do QueueHarbor

O QueueHarbor foi arquitetado para ser a ponte entre o isolamento de infraestrutura e a gestão centralizada. O sistema atua em dois pilares principais:

1. **Gateway de Roteamento Dinâmico (Backend - NestJS):**
   Atua como o ponto único de entrada para a ingestão de *webhooks*. Através da interceptação de metadados na requisição (ex: Headers `x-tenant-id`), a API despacha dinamicamente o *job* para o banco lógico ou instância física do Redis correspondente, mantendo o processamento assíncrono estritamente isolado.

2. **Observabilidade Centralizada (Frontend - Angular 21):**
   Um *Single Pane of Glass* (Painel Único de Controle). A interface se conecta simultaneamente a todas as instâncias do BullMQ mapeadas, consolidando as métricas, falhas e *throughput* em um único *dashboard* reativo.

## 🔒 Laboratório de Segurança (Auth Core)

Além da orquestração de filas, o repositório serve como implementação de referência para sistemas de autenticação seguros e resilientes, sem dependência de plataformas de *Identity as a Service* (IDaaS). A *stack* implementa:

* **Gestão de Sessão Hermética:** Integração de NestJS + TypeORM (PostgreSQL) com Angular 21.
* **Refresh Token Rotation:** Interceptores HTTP reativos (RxJS) no frontend que lidam de forma assíncrona com erros `401 Unauthorized`, renovando os tokens de acesso sem interromper a experiência do usuário.
* **Token Versioning:** Estratégia de segurança no banco de dados para revogação instantânea de sessões em caso de alteração de privilégios, invalidando *tokens* legados na próxima transação.
* **Design System Minimalista:** Implementação de componentes PrimeNG envelopados com Tailwind CSS, focados em clareza, usabilidade e design *clean*.

---
*Engenharia pragmática para sistemas distribuídos e alta disponibilidade.*