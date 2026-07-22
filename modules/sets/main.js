class Set {
    constructor(reps=1, unit="lbs", mag=1) {
        this.reps = reps;
        this.unit = unit;
        this.mag = mag;
        this.exercise = null;
    }

    setExercise(exercise) {
        this.exercise = exercise;
    }
}
