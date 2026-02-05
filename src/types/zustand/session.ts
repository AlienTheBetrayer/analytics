type Animation = {
    header: boolean;
};

export type SessionStore = {
    animations: {
        header: boolean;
    };

    /**
     * modifies the animations object 
     * @param animations partial animations object
     */
    updateAnimations: (animations: Partial<Animation>) => void;
};
