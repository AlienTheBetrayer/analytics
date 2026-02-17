import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Input } from "@/features/ui/input/components/Input";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    data: CacheAPIProtocol["noteboards"]["data"][number]["elements"][number];
    onCheck: (flag: boolean) => void;
    onEdit: (value: string) => void;
    onDelete: () => void;
};

export const Element = ({ data, onCheck, onEdit, onDelete }: Props) => {
    // states
    const [editing, setEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(data.title);

    // refs
    const inputRef = useRef<HTMLInputElement | null>(null);

    // focusing
    useEffect(() => {
        if (!editing || !inputRef.current) {
            return;
        }
        inputRef.current.focus();
    }, [editing]);

    return (
        <div className="box p-0! bg-bg-2! w-full flex-row! items-center!">
            <Checkbox
                className="w-fit!"
                value={data.checked}
                onToggle={onCheck}
            />
            {editing ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onEdit(title);
                        setEditing(false);
                    }}
                >
                    <Input
                        ref={inputRef}
                        onKeyDown={(e: React.KeyboardEvent) => {
                            switch (e.code) {
                                case "Escape": {
                                    setEditing(false);
                                    break;
                                }
                            }
                        }}
                        required
                        minLength={4}
                        placeholder="Enter..."
                        className="w-full"
                        value={title}
                        onChange={(value) => setTitle(value)}
                    />
                </form>
            ) : (
                <Button
                    className="w-full justify-start!"
                    onClick={() => setEditing(true)}
                >
                    <span>{data.title}</span>
                </Button>
            )}

            <Button onClick={onDelete}>
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/delete.svg"
                />
            </Button>
        </div>
    );
};
