[![CI](https://github.com/MatheusCFBT/AccessCorp.Backend/actions/workflows/build.yml/badge.svg)](https://github.com/MatheusCFBT/AccessCorp.Backend/actions/workflows/build.yml)
# AccessCorp Backend - Plataforma de Gerenciamento de Acessos

Uma aplicação backend desenvolvida em C# com .NET, focada na gestão de usuários e autenticação, utilizando práticas modernas de arquitetura e desenvolvimento.

---
###### AccessCorp Backend é um projeto acadêmico desenvolvido como parte da disciplina de Projeto Prático de Programação, com o objetivo de aplicar conceitos de autenticação, autorização, CRUD e DevOps.

## ⭐ Dê uma estrela!

Se este projeto te ajudou ou chamou sua atenção, deixe uma estrela no repositório!

## Tecnologias e componentes implementados 

- .NET 8
    - ASP.NET WebApi
    - JWT
    - ASP.NET Identity
    - Entity Framework Core 

- Componentes / Serviços
    - Swagger UI com suporte para JWT

- Hosting
    - IIS
    - NGINX
    - Docker (com compose)

## Arquitetura

### Arquitetura completa implementando a mais importante e conceitos usados como:

- Clean Code
- Arquitetura Limpa
- DDD - Domain Driven Design
- Repository

## Visão Geral da Arquitetura

### A aplicação está baseada em duas solutions com uma api cada

#### Api de gerenciamento de usuários:
<p align="center">
    <img alt="accesscorp.Users.Sln" src="https://github.com/user-attachments/assets/7df34052-fa76-4167-a5a9-c32041afec4f">
</p>

---

#### Api de Identidade:
<p align="center">
    <img alt="accesscorp.Identity.Sln" src="https://github.com/user-attachments/assets/93864430-9fdc-4cef-b49f-691712326719">
</p>

---

###### Cada Microsserviço possui seu próprio banco de dados. Além disso, A aplicação segue os princípios da arquitetura limpa, com separação de responsabilidades e foco na escalabilidade e manutenção do código. 

## Integração Contínua (CI/CD)
Este repositório utiliza **GitHub Actions** para automação de tarefas como versionamento, build, testes, análise de código e publicação de imagens Docker.

📋 **Workflow:**  ```CI```

```
name: CI

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
  workflow_dispatch:
```
- versioning: Realiza versionamento semântico baseado nos commits.

- build-and-test: compila os projetos, executa testes e publica artefato do resultado dos testes.

- lint: aplica análise estática com **Super Linter** (C#, YAML, etc).

- dependency-check: faz revisão de dependências com base nas PRs.

- code-security-check: realiza análise de segurança com o **GitHub CodeQL**.

- build-docker-image: constrói e publica imagens Docker no DockerHub.



## Iniciando o projeto
É possível rodar o AccessCorp Backend em qualquer sistema operacional. **Mas é necessário possuir o Docker em seu ambiente.**  ([Instalação do Docker](https://docs.docker.com/get-docker/))

Clone o AccessCorp Backend e navegue para a pasta **/Docker** e depois: 

### Se você quiser rodar o AccessCorp Backend em seu ambiente Docker:

```
docker compose -f accesscorp_prod.yml up
```

### Se você quiser rodar local com VS/VS Code:
Você precisará:

- Docker
- Instância do SQL (ou conteiner)

Você pode editar o Docker Compose para rodar o banco de dados e salvar tempo.