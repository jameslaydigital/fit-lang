load ../../test_helper

@test "set shows current set info" {
    run node index.js set
    [ "$status" -eq 0 ]
    assert_output_contains "set - actual work logged"
}

@test "set create creates and selects a set" {
    run node index.js set create
    [ "$status" -eq 0 ]
    assert_output_contains "set created and selected"
}

@test "set reps sets the reps value" {
    run node index.js set create
    id=$(echo "$output" | grep -oP 'set created and selected: \K\S+')
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

@test "set remove removes a set by id" {
    run node index.js set create
    id=$(echo "$output" | grep -oP 'set created and selected: \K\S+')
    run node index.js set remove "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "removed 1 sets"
}

@test "set choose selects a set by id" {
    run node index.js set create
    id=$(echo "$output" | grep -oP 'set created and selected: \K\S+')
    run node index.js set unchoose
    run node index.js set choose "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "set $id chosen"
}

@test "set unchoose unselects current set" {
    run node index.js set create
    run node index.js set unchoose
    [ "$status" -eq 0 ]
}
