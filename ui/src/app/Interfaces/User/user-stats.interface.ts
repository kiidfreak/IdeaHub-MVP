export interface UserStats {
    points: number;
    level: string;
    xp: number;
    xpToNextLevel: number;
    streak: number;
    ideasPosted: number;
    votesReceived: number;
    badges: Badge[];
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earned: boolean;
    earnedAt?: string;
}
