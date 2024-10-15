# Livro de Sonhos

Uma aplicação web para registro, interpretação e visualização de sonhos usando IA, construída com Next.js, Tailwind CSS, e TypeScript.

## Visão Geral do Projeto

O Livro de Sonhos é uma plataforma onde os usuários podem registrar seus sonhos, obter interpretações geradas por IA e criar imagens baseadas nesses sonhos. O sistema utiliza um modelo de créditos para monetização.

## Stack Tecnológica

- Frontend e Backend: Next.js 14 (App Router)
- Estilização: Tailwind CSS
- Componentes UI: shadcn/ui
- Autenticação: Next-Auth v5 com Google Provider
- Banco de Dados: PostgreSQL
- ORM: Prisma
- Linguagem: TypeScript
- Deploy: Vercel
- IA: OpenAI GPT para interpretação, DALL-E para geração de imagens

## Etapas de Desenvolvimento

### 1. Configuração do Projeto

- [x] Inicializar projeto Next.js com TypeScript
- [x] Configurar Tailwind CSS
- [x] Configurar shadcn/ui
- [x] Configurar ESLint e Prettier
- [x] Instalar e configurar Prisma
- [x] Configurar conexão do Prisma com PostgreSQL

### 2. Modelagem do Banco de Dados

- [x] Definir modelo de usuário no schema do Prisma
- [x] Criar modelo de sonhos no schema do Prisma
- [x] Definir modelo de créditos no schema do Prisma
- [x] Criar relações entre os modelos
- [x] Gerar e aplicar migrações iniciais do Prisma

### 3. Autenticação e Usuários

- [x] Configurar Next-Auth v5 com Google Provider
- [x] Integrar Next-Auth com Prisma
- [x] Implementar páginas de login e logout
- [x] Criar middleware para rotas protegidas

### 4. Funcionalidades Core

- [x] Desenvolver API routes para CRUD de sonhos usando Prisma
- [x] Implementar página de registro de sonhos
- [x] Desenvolver página de visualização de sonhos (individual e lista)
- [ ] Integrar OpenAI GPT para interpretação de sonhos
- [ ] Integrar DALL-E para geração de imagens de sonhos
- [x] Implementar sistema básico de créditos usando Prisma (sem compra ainda)

### 5. UI/UX

- [ ] Desenhar e implementar layout responsivo com Tailwind
- [ ] Criar componentes reutilizáveis com shadcn/ui
- [ ] Desenvolver dashboard do usuário
- [ ] Implementar feed de sonhos públicos
- [ ] Criar páginas de erro e loading

### 6. Funcionalidades Adicionais

- [ ] Implementar sistema de tags para sonhos (atualizar schema do Prisma)
- [ ] Criar funcionalidade de busca de sonhos usando Prisma
- [ ] Desenvolver análise de tendências de sonhos
- [ ] Implementar exportação de dados de sonhos

### 7. Otimização e Testes

- [ ] Implementar lazy loading e otimização de imagens
- [ ] Configurar caching estratégico
- [ ] Escrever testes unitários e de integração (incluindo testes para Prisma)
- [ ] Realizar testes de desempenho e otimizações

### 8. Segurança e Conformidade

- [ ] Implementar medidas de segurança (sanitização de input, rate limiting)
- [ ] Configurar políticas de CORS
- [ ] Garantir conformidade com GDPR e outras regulamentações relevantes
- [ ] Implementar práticas de segurança específicas para Prisma (ex: filtering, pagination)

### 9. Preparação para Produção

- [ ] Configurar variáveis de ambiente para produção (incluindo URL do banco de dados)
- [ ] Preparar scripts de migração do banco de dados usando Prisma
- [ ] Configurar monitoramento e logging (ex: Sentry, Logtail)

### 10. Deploy

- [ ] Configurar projeto no Vercel
- [ ] Configurar banco de dados PostgreSQL (ex: Supabase, Neon)
- [ ] Configurar integração do Prisma com o banco de dados de produção
- [ ] Realizar deploy da aplicação
- [ ] Testar toda a aplicação em ambiente de produção

### 11. Integração de Pagamentos (Fase Final)

- [ ] Pesquisar e escolher provedor de pagamentos
- [ ] Implementar sistema de compra de créditos
- [ ] Atualizar schema do Prisma para incluir informações de pagamento, se necessário
- [ ] Testar fluxo de pagamento em ambiente de sandbox
- [ ] Integrar pagamentos ao sistema de créditos existente

## Próximos Passos

1. Iniciar a configuração do projeto Next.js
2. Instalar e configurar Prisma
3. Criar wireframes detalhados para as principais páginas
4. Definir modelos de dados iniciais no schema do Prisma
5. Começar a implementação da autenticação com Next-Auth
