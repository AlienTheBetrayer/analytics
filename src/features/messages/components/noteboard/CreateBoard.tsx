import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";
import { useState } from "react";

export const CreateBoard = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    return (
        <div className="box acrylic p-4! rounded-2xl! gap-1! w-screen max-w-96">
            <div className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/dashboard.svg"
                />
                <span>Create</span>
            </div>

            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <ul className="flex flex-col gap-2">
                    <li>
                        <Input
                            required
                            minLength={4}
                            placeholder="title"
                            value={title}
                            onChange={(value) => setTitle(value)}
                        />
                    </li>

                    <li>
                        <Input
                            placeholder="description (optional)"
                            value={description}
                            onChange={(value) => setDescription(value)}
                        />
                    </li>

                    <li>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/imageadd.svg"
                            />
                            Create
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
