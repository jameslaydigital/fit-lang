load ../../test_helper

@test "exercise shows no exercise selected initially" {
    run node index.js exercise
    [ "$status" -eq 0 ]
    assert_output_contains "no exercise selected"
}

@test "exercise create creates a new exercise" {
    run node index.js exercise create bench-press
    [ "$status" -eq 0 ]
    assert_output_contains "exercise 'bench-press' created"
}

@test "exercise create fails without a name" {
    run node index.js exercise create
    [ "$status" -eq 1 ]
    assert_output_contains "must provide parameter"
}

@test "exercise remove removes an existing exercise" {
    run node index.js exercise create deadlift
    run node index.js exercise remove deadlift
    [ "$status" -eq 0 ]
    assert_output_contains "1 exercise(s) removed"
}

@test "exercise remove with nonexistent name" {
    run node index.js exercise remove nonexistent
    [ "$status" -eq 0 ]
    assert_output_contains "no exercises removed"
}

@test "exercise rename renames an exercise" {
    run node index.js exercise create squat
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).exercises[0].id")
    run node index.js exercise rename "$id" "front-squat"
    [ "$status" -eq 0 ]
    assert_output_contains "renamed to"
}
