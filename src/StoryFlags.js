class StoryFlags {
    constructor(){
        this.flags = new Map();
    }

    add(flag) {
        this.flags.set(flag, true);
    }

    getRelevantScenario(scenarios=[]) {
        return scenarios.find(scenario => {

            // Disqualify when any bypass flags are present
            const bypassFlags = scenario.bypass ?? [];
            for (let I = 0; I < bypassFlags.length; I++) {
                const thisFlag = bypassFlags[I];
                if (this.flags.has(thisFlag)) {
                    return false;
                } 
            }

            // Disqualify if we find a missing required flag
            const requiredFlags = scenario.requires ?? [];
            for (let I = 0; I < requiredFlags; I++) {
                const thisFlag = requiredFlags[I];
                if (!this.flags.has(thisFlag)) {
                    return false;
                } 
            }

            // If we made it this far, this scenario is relevant
            return true;
        })
    }
}

export const TALKED_TO_A = 'TALKED_TO_A ';
export const TALKED_TO_B = 'TALKED_TO_B ';

export const storyFlags = new StoryFlags();