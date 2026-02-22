import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

type Props = {
    type: "checked" | "unchecked";
};

export const NoteboardTabEmpty = ({ type }: Props) => {
    return (
        <AbsentData
            title={
                type === "checked" ? (
                    <>
                        You haven&apos;t checked a single element <u>yet</u>
                    </>
                ) : (
                    <>
                        You have checked <mark>everything</mark>!
                    </>
                )
            }
            description={
                type === "checked" ? (
                    <>
                        Head to another tab and check a few{" "}
                        <mark>elements</mark> and you will see them here!
                    </>
                ) : (
                    <>
                        There are no other elements for you to check, you have
                        done <mark>everything</mark>!
                    </>
                )
            }
        />
    );
};
