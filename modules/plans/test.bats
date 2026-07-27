load ../../test_helper

@test "plan create creates and selects a new plan" {
    run node index.js plan create "test-plan"
    [ "$status" -eq 0 ]
    assert_output_contains "created new plan 'test-plan'"
}

@test "plan list shows all plans" {
    run node index.js plan create "alpha"
    [ "$status" -eq 0 ]
    run node index.js plan create "beta"
    [ "$status" -eq 0 ]
    run node index.js plan list
    [ "$status" -eq 0 ]
    assert_output_contains "alpha"
    assert_output_contains "beta"
}

@test "plan choose selects a plan by id" {
    run node index.js plan create "gamma"
    id=$(echo "$output" | awk '/plan.*selected/ {print $2}')
    run node index.js plan unchoose
    run node index.js plan choose "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "chosen"
}

@test "plan chosen shows selected plan" {
    run node index.js plan create "delta"
    run node index.js plan chosen
    [ "$status" -eq 0 ]
}

@test "plan details shows current plan details" {
    run node index.js plan create "epsilon"
    run node index.js plan details
    [ "$status" -eq 0 ]
    assert_output_contains "current selection"
}

@test "plan unchoose unselects the current plan" {
    run node index.js plan create "delta"
    run node index.js plan unchoose
    [ "$status" -eq 0 ]
    run node index.js plan chosen
    assert_output_contains "empty"
}

@test "plan rename renames a plan" {
    run node index.js plan create "oldname"
    id=$(echo "$output" | awk '/plan.*selected/ {print $2}')
    run node index.js plan rename "$id" "newname"
    [ "$status" -eq 0 ]
    assert_output_contains "renamed to 'newname'"
}

@test "plan remove removes a plan by id" {
    run node index.js plan create "tmp-plan"
    id=$(echo "$output" | awk '/plan.*selected/ {print $2}')
    run node index.js plan remove "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "1 plan(s) removed"
}
