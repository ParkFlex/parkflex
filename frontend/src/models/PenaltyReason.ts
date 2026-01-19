export type PenaltyReason = "WrongSpot" | "Overtime" | "NotArrived";

export const penaltyReasonShowable = (pr: PenaltyReason): string => {
    switch (pr) {
        case "NotArrived": return "Nie przyjechano na parking w odpowiednim czasie";
        case "Overtime": return "Przekroczono zaplanowany czas postoju";
        case "WrongSpot": return "Zaparkowano na miejscu innym niż zadeklarowano";
    }
};