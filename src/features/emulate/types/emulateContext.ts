export type EmulateData = {
    selectedProjectId?: string;
}

export type EmulateDataContext = [EmulateData, React.Dispatch<React.SetStateAction<EmulateData>>];