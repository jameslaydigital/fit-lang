load ../../test_helper

@test "stack list shows empty stack" {
    run node index.js stack list
    [ "$status" -eq 0 ]
}

@test "stack pop on empty stack succeeds" {
    run node index.js stack pop
    [ "$status" -eq 0 ]
    assert_output_contains "popped"
}
