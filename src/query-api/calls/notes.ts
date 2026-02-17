import { queryMutate } from "@/query/auxiliary";
import { Noteboard, NoteboardElement } from "@/types/tables/notes";
import { refreshedRequest } from "@/utils/auth/refreshedRequest";

export const upsertNoteboard = async (
    options: (
        | { type: "create"; title: string; description?: string }
        | {
              type: "edit";
              noteboard_id: string;
              title?: string;
              description?: string;
              pinned?: boolean;
          }
    ) & { user_id: string },
) => {
    if (options.type === "edit") {
        queryMutate({
            key: ["noteboards", options.user_id],
            value: (state) =>
                state.map((n) =>
                    n.id === options.noteboard_id
                        ? {
                              ...n,
                              ...("title" in options && {
                                  title: options.title,
                              }),
                              ...("description" in options && {
                                  description: options.description,
                              }),
                              ...("pinned" in options && {
                                  pinned: options.pinned,
                                  pinned_at: new Date().toISOString(),
                              }),
                          }
                        : n,
                ),
        });
    }

    const res = await refreshedRequest({
        route: "/api/update/noteboard",
        method: "POST",
        body: {
            type: options.type,
            user_id: options.user_id,
            ...("noteboard_id" in options && {
                noteboard_id: options.noteboard_id,
            }),
            ...("title" in options && { title: options.title }),
            ...("description" in options && {
                description: options.description,
            }),
            ...("pinned" in options && { pinned: options.pinned }),
        },
    });
    const data = res.data.noteboard as Noteboard;

    if (data && options.type === "create") {
        queryMutate({
            key: ["noteboards", options.user_id],
            value: (state) => [...state, { ...data, elements: [] }],
        });
    }


    return res;
};

export const deleteNoteboard = async (options: {
    user_id: string;
    noteboard_id: string;
}) => {
    queryMutate({
        key: ["noteboards", options.user_id],
        value: (state) => state.filter((n) => n.id !== options.noteboard_id),
    });

    const res = await refreshedRequest({
        route: "/api/delete/noteboard",
        method: "POST",
        body: {
            ...options,
        },
    });

    return res;
};

export const upsertNote = async (
    options: (
        | {
              type: "create";
              title: string;
              checked?: boolean;
          }
        | {
              type: "edit";
              element_id: string;
              title?: string;
              pinned?: boolean;
              checked?: boolean;
          }
    ) & { user_id: string; noteboard_id: string },
) => {
    let generatedId: null | string = null;

    switch (options.type) {
        case "create": {
            generatedId = crypto.randomUUID();
            queryMutate({
                key: ["noteboards", options.user_id],
                value: (state) =>
                    state.map((n) =>
                        n.id === options.noteboard_id
                            ? {
                                  ...n,
                                  elements: [
                                      ...(n?.elements ?? []),
                                      {
                                          id: `temp${generatedId}`,
                                          checked: options.checked ?? false,
                                          title: options.title,
                                          noteboard_id: options.noteboard_id,
                                          created_at: new Date().toISOString(),
                                          pinned: false,
                                      },
                                  ],
                              }
                            : n,
                    ),
            });
            break;
        }
        case "edit": {
            queryMutate({
                key: ["noteboards", options.user_id],
                value: (state) =>
                    state.map((n) =>
                        n.id === options.noteboard_id
                            ? {
                                  ...n,
                                  elements: n.elements.map((e) =>
                                      e.id === options.element_id
                                          ? {
                                                ...e,
                                                ...("title" in options && {
                                                    title: options.title,
                                                    edited_at:
                                                        new Date().toISOString(),
                                                }),
                                                ...("checked" in options && {
                                                    checked: options.checked,
                                                }),
                                                ...("pinned" in options && {
                                                    pinned: options.pinned,
                                                    pinned_at:
                                                        new Date().toISOString(),
                                                }),
                                            }
                                          : e,
                                  ),
                              }
                            : n,
                    ),
            });
            break;
        }
    }

    const res = await refreshedRequest({
        route: "/api/update/note",
        method: "POST",
        body: {
            type: options.type,
            user_id: options.user_id,
            noteboard_id: options.noteboard_id,
            title: options.title,
            ...("element_id" in options && { element_id: options.element_id }),
            ...("pinned" in options && { pinned: options.pinned }),
            ...("checked" in options && { checked: options.checked }),
        },
    });

    if (generatedId) {
        const data = res.data.note as NoteboardElement;
        queryMutate({
            key: ["noteboards", options.user_id],
            value: (state) =>
                state.map((n) =>
                    n.id === options.noteboard_id
                        ? {
                              ...n,
                              elements: n.elements.map((e) =>
                                  e.id === `temp${generatedId}` ? data : e,
                              ),
                          }
                        : n,
                ),
        });
    }

    return res;
};

export const deleteNote = async (options: {
    user_id: string;
    noteboard_id: string;
    element_id: string;
}) => {
    queryMutate({
        key: ["noteboards", options.user_id],
        value: (state) =>
            state.map((n) =>
                n.id === options.noteboard_id
                    ? {
                          ...n,
                          elements: n.elements.filter(
                              (e) => e.id !== options.element_id,
                          ),
                      }
                    : n,
            ),
    });

    return await refreshedRequest({
        route: "/api/delete/note",
        method: "POST",
        body: {
            user_id: options.user_id,
            element_id: options.element_id,
        },
    });
};
