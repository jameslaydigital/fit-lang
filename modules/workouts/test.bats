load ../../test_helper

@test "workout shows no workout selected initially" {
    run node index.js workout
    [ "$status" -eq 0 ]
    assert_output_contains "no workout selected"
}

@test "workout create creates a new workout" {
    run node index.js workout create "leg-day"
    [ "$status" -eq 0 ]
    assert_output_contains "workout 'leg-day' created"
}

@test "workout list shows workouts" {
    run node index.js workout create "upper"
    run node index.js workout list
    [ "$status" -eq 0 ]
    assert_output_contains "upper"
}

@test "workout list ids outputs workout ids" {
    run node index.js workout create "pull"
    run node index.js workout list ids
    [ "$status" -eq 0 ]
    [ "${#lines[@]}" -ge 1 ]
}

@test "workout rename renames a workout" {
    run node index.js workout create "old-name"
    run node index.js workout list ids
    id="${lines[0]}"
    run node index.js workout rename "$id" "new-name"
    [ "$status" -eq 0 ]
    assert_output_contains "renamed to 'new-name'"
}

@test "workout remove removes a workout by name" {
    run node index.js workout create "push-day"
    run node index.js workout remove "push-day"
    [ "$status" -eq 0 ]
    assert_output_contains "1 workout(s) removed"
}

@test "workout choose selects a workout by id" {
    run node index.js workout create "push"
    run node index.js workout list ids
    id="${lines[0]}"
    run node index.js workout choose "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "workout $id chosen"
}

@test "workout unchoose unselects current workout" {
    run node index.js workout create "cardio"
    run node index.js workout list ids
    id="${lines[0]}"
    run node index.js workout choose "$id"
    run node index.js workout unchoose
    [ "$status" -eq 0 ]
    run node index.js workout
    assert_output_contains "no workout selected"
}
