---
id: RULE-015
always-apply: false
title: HTTP routes
status: implemented
priority: high
date: 2026-09-20
deciders:
  - Jonatas Sales
---

# HTTP routes

BFF routes repeat this tree per verb/resource:

```text
app/api/<context>/<action>/route.ts
app/api/<context>/<action>/<action>.types.ts
app/api/<context>/<action>/instance.ts
app/api/<context>/<action>/guards/is-<action>-body-valid.ts
app/api/<context>/<action>/services/<action>-service/<action>.ts
```

## 1 - `route.ts` only wires

Parse, guard, construct the service, return. Catch goes to the shared error service.

```ts
export async function POST(request: Request): Promise<NextResponse> {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()

  try {
    const body = await request.json()
    const loginService = new LoginService(
      isLoginBodyValid(body),
      requestId,
      loginInstance
    )

    return await loginService.login()
  } catch (error) {
    const errorFactory = new ErrorFactoryService(HTTP_ERROR_MAP)
    const errorService = new ErrorService(errorFactory)

    return errorService.normalizeRouteError(error, requestId)
  }
}
```

## 2 - The guard is the only parser

```ts
export function isLoginBodyValid(body: unknown): LoginState {
  const parsed = loginSchema.parse(body)

  return parsed
}
```

## 3 - The service is a class in its folder

Constructor takes body, request id, and HTTP client. One public method. No extra helpers in `route.ts`.

## 4 - Errors are a map plus a factory

Status metadata lives in `http-errors.ts`. `ErrorFactoryService` and `ErrorService` own normalization. Routes do not `NextResponse.json({ message })` by hand.

## 5 - Instances are one file

`instance.ts` next to the route creates the client. Interceptors stay there.
