setup() {
    cp data.json /tmp/flang.bak.$$ 2>/dev/null || true
    cp stack.json /tmp/flang.stack.bak.$$ 2>/dev/null || true
    echo '{"exercises":[],"workouts":[],"plans":[],"sets":[]}' > data.json
    echo '[]' > stack.json
}

teardown() {
    mv /tmp/flang.bak.$$ data.json 2>/dev/null || true
    mv /tmp/flang.stack.bak.$$ stack.json 2>/dev/null || true
}

assert_output_contains() {
    if [[ "$output" != *"$1"* ]]; then
        echo "FAIL: expected output to contain '$1'"
        echo "output: $output"
        return 1
    fi
}
