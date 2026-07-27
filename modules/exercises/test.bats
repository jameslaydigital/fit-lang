load ../../test_helper

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

@test "exercise list shows all exercises" {
    run node index.js exercise create bench-press
    run node index.js exercise list
    [ "$status" -eq 0 ]
    assert_output_contains "bench-press"
}

@test "exercise choose selects an exercise by id" {
    run node index.js exercise create squat
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).exercises.find(e=>e.name==='squat').id")
    run node index.js exercise choose "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "chosen"
}

@test "exercise chosen shows selected exercise" {
    run node index.js exercise create deadlift
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).exercises.find(e=>e.name==='deadlift').id")
    run node index.js exercise choose "$id"
    run node index.js exercise chosen
    [ "$status" -eq 0 ]
    assert_output_contains "$id"
}

@test "exercise details shows current exercise details" {
    run node index.js exercise create squat
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).exercises.find(e=>e.name==='squat').id")
    run node index.js exercise choose "$id"
    run node index.js exercise details
    [ "$status" -eq 0 ]
    assert_output_contains "current selection"
}

@test "exercise unchoose unselects current exercise" {
    run node index.js exercise create curl
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).exercises.find(e=>e.name==='curl').id")
    run node index.js exercise choose "$id"
    run node index.js exercise unchoose
    [ "$status" -eq 0 ]
    run node index.js exercise chosen
    assert_output_contains "empty"
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
