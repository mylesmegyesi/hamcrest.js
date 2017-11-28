TEST_DIR   := ./spec
TEST_FILES := '$(TEST_DIR)/**/*Spec.ts'

NPM_BIN := ./node_modules/.bin
MOCHA   := $(NPM_BIN)/mocha
TSLINT  := $(NPM_BIN)/tslint

TS_CONFIG := ./tsconfig.json

.PHONY: test
_TEST :=
test:
	TS_NODE_PROJECT=$(TS_CONFIG) $(MOCHA) --colors --no-exit --require ts-node/register $(TEST_FILES)

_LINT := $(TSLINT) --format prose --project $(TS_CONFIG)
.PHONY: lint
lint:
	$(_LINT)

.PHONY: lint-fix
lint-fix:
	$(_LINT) --fix
