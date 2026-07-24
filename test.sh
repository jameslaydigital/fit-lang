#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
bats test.bats $(find modules -name test.bats | sort)
