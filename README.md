# Projeto Cluster

Este é um projeto [Next.js](https://nextjs.org/) inicializado com [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). O projeto consiste em uma aplicação similar a uma rede social que tem como objetivo juntar estudantes em grupos que poder ter diversas categorias.

## Sobre o Projeto

Este projeto é uma aplicação web desenvolvida com Next.js. Ele inclui várias funcionalidades, como renderização do lado do servidor, rotas dinâmicas, pré-renderização, suporte à PWA, banco de dados Postgres com Prisma ORM, utilização de service workers para notificações e caching, next-auth para entrada com serviços de terceiros, nodemailer para enviar emails e socket.io para a comunicação de websockets em tempo real.

A aplicação utiliza Typescript como linguagem principal devido a tipagem, que faz o desenvolvimento ser mais seguro e direto ao ponto. Javascript também é utilizado para alguns serviços como conexão socket e encaminhamento de emails.

Outras linguagens estrangeiras como Python também foram utilizadas para gerar conteúdos estáticos como as imagens para o PWA.

## Como executar

Primeiro, instale as dependências do projeto:

```bash
npm install
# ou
yarn install
```

Em seguida, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

**Nota:** Vale ressaltar que, como o projeto está rodando em um arquivo customizado `server.mjs`, não está pronto para rodar de forma serverless.

## Configuração do arquivo .env

Crie um arquivo `.env` na raiz do projeto e preencha-o com suas variáveis de ambiente. O exemplo está no arquivo `.env.example`.

## Estrutura do Projeto

-   `components/`: Esta pasta contém todos os componentes React usados na aplicação, separados em categorias e em formato _.tsx_.
-   `styles/`: Aqui estão os arquivos de estilo globais e locais.
-   `app/`: Esta pasta contém todas as rotas da aplicação. Cada arquivo corresponde a uma rota, a pasta `(pwp)/` guarda as rotas que contêm a navbar presente.
-   `public/`: Esta pasta contém todos os arquivos estáticos como imagens e ícones.

## Segurança

Todos os formulários têm um honeypot para prevenir a criação de contas por spammers e bots. Ele é chamado de "numberval". São validados somente no servidor, logo as requisições continuam, porém sem interferir no banco de dados.

## To-Do

-   [ ] Rotas do servidor dentro das pastas `lib/db` ainda precisam ser validadas por motivos de segurança;
-   [ ] A autenticação do Socket.Io precisa ser melhorada;
-   [ ] Blobs precisam ser removidos quando seus respectivos posts/usuários/grupos são deletados;
-   [ ] Entre outros problemas menores de optimização e simplificação de código;

## Autores

Este projeto é mantido pelos seguinters indivíduos:

-   **Wynvern** - Desenvolvedor - [GitHub](https://github.com/wynvern)
-   **PietroSko** - Gerente do Projeto - [GitHub](https://github.com/pietrosko)
-   **Gemellix2322** - Designer e Encarregado dos Documentos - [GitHub](https://github.com/gemellix2322)

Cada um contribuiu com suas habilidades e conhecimentos únicos para a criação e manutenção deste projeto.
