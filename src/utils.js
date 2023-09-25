export function isTimeWithinTradingHours() {
    const dateInEastern = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const easternDateObject = new Date(dateInEastern);

    const hours = easternDateObject.getHours();
    const minutes = easternDateObject.getMinutes();

    // Defining the start and end times
    const startHour = 9;
    const startMinute = 30;
    const endHour = 16;
    const endMinute = 0;

    if (hours < startHour || hours > endHour) {
        return false;
    } else if (hours === startHour && minutes < startMinute) {
        return false;
    } else if (hours === endHour && minutes >= endMinute) {
        return false;
    }

    return true;
}

export class RateLimiter {
    constructor(limit, interval) {
        this.tokens = limit;
        this.limit = limit;
        this.interval = interval;
        setInterval(() => this.addToken(), interval);
    }

    addToken() {
        if (this.tokens < this.limit) {
            this.tokens++;
        }
    }

    allowRequest() {
        if (this.tokens > 0) {
            this.tokens--;
            console.log(this.tokens)
            return true;
        }
        return false;
    }
}