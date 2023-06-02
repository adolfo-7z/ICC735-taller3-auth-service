# ICC735 - Taller 3 : Auth Service

## Auth service endpoints

- Register: ✅ (only on local environment)
- Login: ✅
- Verify Email: ✅
- Get User: 🔜

## Initialize and run local

_Need a mongo database connection_

```
Set the environment variables in env/.local.env file:
- HOST: HOST for swagger client
- PORT: running port number and for swagger client
- MONGO_URI: Mongo URI full format `mongodb://user:pass@host:port/databaseName`
```

## Run locally

```
npm i
npm run local
```

## API Documentation in Swagger: /docs

## Tests and coverage

```
npm run test
npm run coverage
```
## IMPORTANT

The project tests were performed, trying to overcome the 80% of coverage, and we did, it is worth mentioning that the user.model tests can fail if mongo version is not correct or if it is not running, we tried to perform the mock for the civil registry service, but unfortunately this never worked <br/>
<img src="assets/coverage.png" height="651px" width="686px"/>

# Members

- Adolfo Plaza
- Alejandro Valenzuela
- Rodrigo Valenzuela