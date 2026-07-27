load ../../test_helper

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

@test "workout choose selects a workout by id" {
    run node index.js workout create "push"
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).workouts.find(w=>w.name==='push').id")
    run node index.js workout choose "$id"
    [ "$status" -eq 0 ]
    assert_output_contains "chosen"
}

@test "workout chosen shows selected workout" {
    run node index.js workout create "pull"
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).workouts.find(w=>w.name==='pull').id")
    run node index.js workout choose "$id"
    run node index.js workout chosen
    [ "$status" -eq 0 ]
    assert_output_contains "$id"
}

@test "workout details shows current workout details" {
    run node index.js workout create "leg-day"
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).workouts.find(w=>w.name==='leg-day').id")
    run node index.js workout choose "$id"
    run node index.js workout details
    [ "$status" -eq 0 ]
    assert_output_contains "current selection"
}

@test "workout unchoose unselects current workout" {
    run node index.js workout create "cardio"
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).workouts.find(w=>w.name==='cardio').id")
    run node index.js workout choose "$id"
    run node index.js workout unchoose
    [ "$status" -eq 0 ]
    run node index.js workout chosen
    assert_output_contains "empty"
}

@test "workout rename renames a workout" {
    run node index.js workout create "old-name"
    id=$(node -p "JSON.parse(require('fs').readFileSync('data.json','utf8')).workouts.find(w=>w.name==='old-name').id")
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
