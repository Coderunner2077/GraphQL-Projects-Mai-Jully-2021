function timeDifference(current, previous) {
    const millPerMin = 60 * 1000;
    const millPerHour = millPerMin * 60;
    const millPerDay = millPerHour * 24;
    const millPerMonth = millPerDay * 30;
    const millPerYear = millPerMonth * 12;

    const elapsed = current - previous;

    if(elapsed< millPerMin /3)
        return "just now";
    if(elapsed < millPerMin)
        return "less than 1 min ago";
    else if(elapsed < millPerHour) 
        return `${Math.round(elapsed/millPerMin)} min ago`;
    else if(elapsed < millPerDay)
        return `${Math.round(elapsed / millPerHour)} hours ago`;
    else if(elapsed < millPerMonth) 
        return `${Math.round(elapsed / millPerDay)} days ago`;
    else if(elapsed < millPerYear)
        return `${Math.round(elapsed / millPerMonth)} mo ago`;
    else
        return `${Math.round(elapsed / millPerYear)} years ago`;
}

export function timeDifferenceForDate(date) {
    const now = new Date().getTime();
    const updated = new Date(date).getTime();
    return timeDifference(now, updated);
}