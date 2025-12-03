export interface LeaderboardUser {
    rank: number;
    userId: string;
    name: string;
    level: string;
    points: number;
    ideasPosted: number;
    votesReceived: number;
    avatar?: string;
    trend?: 'up' | 'down' | 'same';
    rankChange?: number;
}
