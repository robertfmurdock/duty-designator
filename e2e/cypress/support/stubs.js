import {format} from "date-fns";

export const apiDateFormat = 'yyyy-MM-dd';

export function stubCorral() {
    const pioneers = [
        {name: "Dewy Dooter", id: "10"},
        {name: "Rosy Rosee", id: "11"}
    ];
    const chores = [
        {name: "Burrito builder", description: "Build burritos", id: "101"},
        {name: "Horseshoer", description: "shoe horses", id: "102"}
    ];
    const today = format(new Date(), apiDateFormat);
    return {date: today, pioneers, chores};
}
