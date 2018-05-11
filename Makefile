
.PHONY: build
build:
	npx tsc --project tsconfig.json

.PHONY: test
test: build
	npx mocha --recursive out/test

.PHONY: lint
lint:
	npx tslint --project tsconfig.json

.PHONY: lint-fix
lint-fix:
	npx tslint --project tsconfig.json --fix

.PHONY: install
install:
	yarn install

.PHONY: ci
ci: install test lint
