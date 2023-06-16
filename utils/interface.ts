export interface User {
    uuid: string;
    startTimestamp: number;
    endTimestamp: number;
    name: string | null;
    isWinner: boolean;
}