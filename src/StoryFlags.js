class StoryFlags {
    constructor(){
        this.flags = new Map();
    }

    add(flag) {
        this.flags.set(flag, true);
    }

    getRelevantScenario(scanarios=[]) {
        return scanarios[0];
    }
}

export const TALKED_TO_A = 'TALKED_TO_A ';
export const TALKED_TO_B = 'TALKED_TO_B ';

export const storyFlags = new StoryFlags();