
class Workout {
    constructor(name) {
        if (typeof name !== "string") {
            throw new Error("workout name must be a string");
        }
        if (name === "") {
            throw new Error("workout name is empty");
        }
        this.name = name;
        this.plan = null;
    }

    setPlan(plan) {
        this.plan = plan;
    }
}
