export type Exercise = {
    name: String,
    primary_muscle: string,
    balance: string,
    muscle_group: MuscleGroupEnum
}

enum MuscleGroupEnum {
    Chest = "chest",
    Back = "back",
    Legs = "legs",
    Arms = "arms",
    Core = "core",
    Delts = "delts"
}