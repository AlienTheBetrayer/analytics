import { Noteboard, NoteboardElement } from "@/types/tables/notes";

export type CacheAPIProtocolNoteboard = {
    noteboard: {
        key: ["noteboard", string];
        value: Noteboard & { elements: NoteboardElement };
    };
};
