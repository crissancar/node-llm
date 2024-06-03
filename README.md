<div align="center">
  <h1>Node.js LLM</h1>

  <p>
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
  </p>
</div>

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [Technologies and skills](#technologies-and-skills)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Infrastructure](#infrastructure)
    * [Databases](#databases)
    * [Running the apps](#running-the-apps)
* [Postman](#postman)
* [Documentation](#documentation)

<!-- Technologies -->
## Technologies and skills
As **technologies and tools**, this skeleton API uses:
- **Node.js and Express.js** as development framework
- **Langchain** as LLM framework
- **Mongodb** as database
- **Elasticsearch** as search server

<!-- GETTING STARTED -->
## Getting Started

This is an instructions on setting up the project locally.

### Prerequisites
Have **node** and **nvm** installed. Use version **18**.
```bash
$ nvm use 18.16.0
```

### Installation

1. Clone repository
```bash
$ git clone https://github.com/crissancar/node-llm
```
2. Install dependencies
```bash
$ npm install
```

### Environment
Rename the .env.example file to .env and assign the variables values

### Infrastructure
```bash
$ docker-compose up -d
```

### Databases
#### MongoDB
Connect with MongoDB Atlas cluster

#### Elasticsearch
Prepare Elasticsearch by launching the configuration command to create the indexes and TTL policy
```bash
$ npm run command:elasticsearch
```

### Running the apps
```bash
$ npm run start:dev
```

<!-- POSTMAN -->
## Postman
To get the **Postman collection**, download the file *Node.js - LLM.postman_collection.json* from the root directory.

<!-- DOCUMENTATION -->
## Documentation
- [Langchain](https://js.langchain.com/v0.2/docs/how_to/)