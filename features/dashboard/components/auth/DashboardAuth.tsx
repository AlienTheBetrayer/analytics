import { Input } from "@/features/ui/input/components/Input";
import { motion } from "motion/react";

export const DashboardAuth = () => {
	return (
		<motion.div
			className="flex flex-col p-2 fixed top-4 right-4 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 z-10 gap-2 outline-1 outline-background-5 w-64"
			initial={{ opacity: 0, y: -30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ ease: "backInOut", duration: 0.5 }}
		>
            <h4 className='text-center'>Authenticate</h4>
            <div className='flex gap-1'>
                <Input/>
            </div>
        </motion.div>
	);
};
