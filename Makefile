.PHONY: test
test:
	bats test.bats $$(find modules -name test.bats | sort)
