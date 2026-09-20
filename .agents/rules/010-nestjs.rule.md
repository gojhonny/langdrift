---
id: RULE-010
always-apply: false
title: Nest.js
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# Nest.js

## 1 - Do not invent a Nest app here

LangDrift has no Nest workspace yet. Do not scaffold one. When a domain service exists, every service copies this tree. A second developer must already know the layers before opening the repo.

## 2 - Four layers, always

```text
src/app.module.ts
src/<context>/<context>.module.ts
src/<context>/domain/
  entities/
  value-objects/
  events/
  ports/
src/<context>/application/
  use-cases/
  services/
src/<context>/infra/
  <vendor>/adapters/
  <vendor>/mappers/
  <vendor>/schemas/
  event-bus/
src/<context>/interface/
  http/          # controllers, pipes, guards
  dto/
  consumers/
```

Do not skip a layer because the service is small. Do not put Mongoose code in `domain/` or use cases in `interface/`.

## 3 - The controller only executes

A controller injects use cases and returns `useCase.execute(...)`. It does not query ports, hash passwords, or map documents.

```ts
@Post('login')
@HttpCode(200)
async loginHandler(
  @Req() request: Request,
  @Body(LoginBodyPipe) body: LoginRequestDto
): Promise<AuthorityResponseDto> {
  return this.login.execute({
    email: body.email,
    password: body.password,
    context: getRequestContext(request)
  })
}
```

HTTP methods are named `*Handler`.

## 4 - The pipe is the unknown edge

Each body has a pipe. The pipe takes `unknown`, parses with Zod, returns the DTO. The controller does not call `schema.parse`.

## 5 - Ports are abstract; adapters implement them

```ts
export abstract class UserPort {
  abstract findByEmail(email: Email): Promise<User | null>
}
```

```ts
@Injectable()
export class MongooseUserAdapter implements UserPort {
  // mapper.toDomain / toPersistence only
}
```

The module binds `provide: UserPort, useClass: MongooseUserAdapter`. Use cases depend on the port, never on Mongoose.

## 6 - A use case extends kernel `UseCase`

```ts
@Injectable()
export class LoginUseCase extends UseCase<LoginInput, LoginResult> {
  async execute(input: LoginInput): Promise<LoginResult> {}
}
```

One use case file per operation: `login.usecase.ts`. Input and result types live next to it or in the same file when they are only used there.

## 7 - Value objects come from kernel

`Email.create`, private constructor, `extends ValueObject`. Do not store raw email strings in the domain entity when a VO already exists.

## 8 - No `utils`

A file named `*.util.ts` is not the pattern even if a couple exist. Put parsing in `pipes/`, metadata in a named helper that states the job.
