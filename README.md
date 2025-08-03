# API de Conversión de Divisas – Arquitectura Basada en Microservicios

Este proyecto consiste en una API desarrollada con **NestJS** y desplegada automáticamente en **AWS Fargate** utilizando GitHub Actions. La solución está compuesta por múltiples microservicios independientes que consultan diferentes proveedores de tasas de cambio y un **orchestrator** que coordina las respuestas.

> El sistema implementa una política de reintento automática para garantizar tolerancia a fallos: si un proveedor no responde o falla, se intenta nuevamente antes de descartar su resultado.

---

## Endpoint de Producción

**GET**

```
http://technical-test-alb-321350010.us-east-2.elb.amazonaws.com/exchange/bestExchange?sourceCurrency=USD&targetCurrency=DOP&amount=100
```

### Parámetros:

- `sourceCurrency`: moneda de origen (ej. `USD`)
- `targetCurrency`: moneda de destino (ej. `DOP`)
- `amount`: monto a convertir (ej. `100`)

### Ejemplo de respuesta:

```json
{
  "provider": "FloatRates",
  "rate": 60.86411364,
  "convertedAmount": 6086.411364
}
```

---

## Arquitectura

### Microservicios

- **Fixer Service**: se conecta con `https://data.fixer.io/api/latest`
- **ExchangeRate Service**: se conecta con `https://open.er-api.com/v6`
- **FloatRates Service**: se conecta con `https://www.floatrates.com`
- **Orchestrator Service**: consume los tres servicios anteriores vía TCP, selecciona la mejor tasa y responde al cliente.

Cada microservicio está desacoplado y preparado para desplegarse de forma independiente en AWS Fargate.

> En caso de error o inestabilidad en alguno de los servicios, el orchestrator realiza múltiples reintentos automáticos antes de ignorar su resultado. Esta política mejora la resiliencia y reduce la posibilidad de fallos ante respuestas inválidas.

---

## Despliegue Continuo

El flujo de integración y despliegue continuo (CI/CD) se gestiona con GitHub Actions:

1. Ejecuta pruebas unitarias automáticamente.
2. Solo si las pruebas son exitosas, construye las imágenes Docker.
3. Las imágenes son subidas a ECR.
4. Se actualizan automáticamente los servicios en AWS Fargate.

---

## Pruebas Unitarias

Antes del despliegue se ejecutan todos los tests definidos en los archivos `*.spec.ts`.

Comando para correr pruebas localmente:

```bash
npm run test
```

---

## Desarrollo local

Para levantar todos los servicios en local:

```bash
docker compose up --build
```

---

## Estructura del proyecto

```
apps/
  ├── fixer-service
  ├── exchangerate-service
  ├── floatrates-service
  └── orchestrator-service
```

Cada microservicio incluye su propio `Dockerfile`, pruebas unitarias y configuración independiente.

---

## Requisitos

- Node.js 18+
- Docker

---

## Recomendación

1. Crear archivo `.env` con las claves necesarias (ej. `FIXER_KEY`)
2. Ejecutar:
   ```bash
   docker compose up --build
   ```
3. Probar la API:
   ```bash
   curl "http://localhost:3000/exchange/bestExchange?sourceCurrency=USD&targetCurrency=DOP&amount=100"
   ```
