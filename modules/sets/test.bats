load ../../test_helper

@test "set create creates and selects a set" {
    run node index.js set create
    [ "$status" -eq 0 ]
    assert_output_contains "set created and selected"
}

@test "set reps sets the reps value" {
    run node index.js set create
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).sets[0].id")
    run node index.js set reps 10
    [ "$status" -eq 0 ]
    assert_output_contains "reps set to 10"
}

@test "set amount sets amount with unit" {
    run node index.js set create
    run node index.js set amount 50 kg
    [ "$status" -eq 0 ]
    assert_output_contains "amount set to 50 kg"
}

@test "set list shows all sets" {
    run node index.js set create
    run node index.js set list
    [ "$status" -eq 0 ]
}

@test "set choose selects a set by id" {
    run node index.js set create
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).sets[0].id")
    run node index.js set unchoose
    run node index.js set choose "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "chosen"
}

@test "set chosen shows selected set" {
    run node index.js set create
    run node index.js set chosen
    [ "$status" -eq 0 ]
}

@test "set details shows current set details" {
    run node index.js set create
    run node index.js set details
    [ "$status" -eq 0 ]
    assert_output_contains "current selection"
}

@test "set unchoose unselects current set" {
    run node index.js set create
    run node index.js set unchoose
    [ "$status" -eq 0 ]
    run node index.js set chosen
    assert_output_contains "empty"
}

@test "set remove removes a set by id" {
    run node index.js set create
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).sets[0].id")
    run node index.js set remove "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "removed 1 sets"
}
