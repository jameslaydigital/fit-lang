load test_helper

@test "app prints help without arguments" {
    run node index.js
    [ "$status" -eq 0 ]
    assert_output_contains "fit - a fitness tracking platform"
}

@test "app shows available commands" {
    run node index.js
    assert_output_contains "available commands:"
}
