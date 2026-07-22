
class Exercise {
    constructor(name) {
        if (typeof name !== "string") {
            throw new Error("exercise name must be a string");
        }
        if (name === "") {
            throw new Error("exercise name is empty");
        }
        this.name = name;
        this.workout = null;
    }

    setWorkout(workout) {
        this.workout = workout;
    }
}
