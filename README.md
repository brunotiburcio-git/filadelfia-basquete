# Filadélfia Basquete

Página institucional da **Associação Filadélfia Basquete**, projeto social que há uma década promove o basquete para crianças, jovens e adultos em Taguatinga Sul e Norte, Ceilândia e entorno (DF). Não há peneiras: todos são acolhidos, divididos por nível e categoria.

Repositório: https://github.com/brunotiburcio-git/filadelfia-basquete

## Sumário

1. [Visão geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Pré-requisitos](#pré-requisitos)
4. [Instalação e execução local](#instalação-e-execução-local)
5. [Build e testes](#build-e-testes)
6. [Estrutura do projeto](#estrutura-do-projeto)
7. [Formulário de apoio e Supabase](#formulário-de-apoio-e-supabase)
8. [Versionamento](#versionamento)
9. [Contato e autoria](#contato-e-autoria)

## Visão geral

A página reúne, em um único `index.html`:

- **Sobre o projeto:** missão e acesso igualitário ao basquete.
- **Escolinha de Basquete:** mensalidade de R$ 80,00 em 2026.
- **Locais de treinamento:** CEF 03 (Taguatinga Sul) e EPAT (Ceilândia).
- **Últimos resultados** dos times de competição (SUB 15, 16, 17 e 19).
- **Links úteis:** Instagram, inscrições (masculino e feminino), transparência e termo de fomento.
- **Como ajudar:** doação de materiais, Pix, divulgação e formulário de apoio.
- **Na mídia:** matéria do Correio Braziliense e vídeo do Campeonato Brasileiro 2025.

## Tecnologias

| Camada | Tecnologia | Uso |
|---|---|---|
| Estrutura | HTML5 semântico | `header`, `main`, `section`, `aside`, `article`, `footer`, `form` |
| Estilo | CSS3 (`css/style.css`) | Layout e aparência da página |
| Comportamento | JavaScript (no `index.html`) | Envio do formulário de apoio via `fetch` |
| Banco de dados | Supabase (PostgreSQL + API REST) | Tabela `inscricoes` com RLS |
| Back-end (preparado) | Supabase Edge Function (Deno/TypeScript) | `supabase/functions/inscrever`: valida captcha Cloudflare Turnstile antes de gravar |

## Pré-requisitos

Para apenas ver e editar a página:

- Um navegador atual (Chrome, Edge, Firefox).
- [Git](https://git-scm.com/downloads) para clonar o repositório.
- Opcional: [Node.js](https://nodejs.org) para servir os arquivos com `npx serve`.

Para trabalhar na Edge Function (opcional):

- [Supabase CLI](https://supabase.com/docs/guides/cli) e uma conta no Supabase.

## Instalação e execução local

```bash
# 1. Clonar o repositório
git clone https://github.com/brunotiburcio-git/filadelfia-basquete.git
cd filadelfia-basquete

# 2. Executar: opção A, abrir o arquivo no navegador
#    (dê duplo clique em index.html)

#    opção B, servir com um servidor estático (recomendado)
npx serve .
```

Não há dependências a instalar (`npm install` não é necessário): o projeto é estático e não usa `package.json`.

Para atualizar uma cópia já clonada: `git pull`.

## Build e testes

- **Build:** não existe etapa de build. Os arquivos são publicados como estão.
- **Testes:** ainda não há testes automatizados. A verificação atual é manual: abrir a página, navegar pelas seções e enviar o formulário de apoio.

## Estrutura do projeto

```
index.html                           página única (conteúdo + script do formulário)
css/style.css                        estilos
img/                                 logomarca e imagem da matéria
supabase/functions/inscrever/        Edge Function (captcha + gravação)
README.md
```

## Formulário de apoio e Supabase

O formulário "Quem é você?" envia nome, e-mail, telefone, data de nascimento e idade para a tabela `inscricoes`:

- O script do `index.html` usa a **chave publicável** do Supabase (`sb_publishable_...`), pensada para ser pública e protegida por **RLS** e `check` no banco.
- Um campo oculto (`site`) funciona como *honeypot*: se preenchido, o envio é descartado.
- **Nunca** coloque a chave secreta (`sb_secret`/service role) no código da página.
- A Edge Function `inscrever` valida um token Turnstile e usa os segredos `TURNSTILE_SECRET_KEY` e `SUPABASE_SERVICE_ROLE_KEY`, configurados no Supabase, não no repositório. Ela está preparada, mas **ainda não é chamada pelo `index.html`**.

## Versionamento

- Controle de versão com **Git**, hospedado no GitHub, remoto `origin`.
- Hoje o projeto usa uma única branch, **`main`**, com commits lineares e mensagens descritivas em português (ex.: `migra formulário do Google Apps Script para o Supabase`).
- Ainda não há tags de versão, issues, milestones nem pull requests.
- Fluxo planejado (GitFlow simplificado): `main` para versões estáveis, `develop` para integração e `feature/*` para cada funcionalidade nova, integradas por pull request.

## Contato e autoria

- E-mail: filadelfiabasqueteoficialadm@gmail.com
- Telefone: (61) 98265-0090
- Site desenvolvido por Bruno Tiburcio.
