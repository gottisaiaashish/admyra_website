"use client";

import { motion } from "framer-motion";

function HandWrittenTitle({
    prefix = "",
    title = "Predictor",
    subtitle = "",
}) {
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { 
                    duration: 2.5, 
                    ease: [0.43, 0.13, 0.23, 0.96],
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 1.5
                },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className="relative w-full flex flex-col items-center justify-center pt-2 pb-2 overflow-hidden">
            <div className="flex items-center justify-center gap-0 flex-nowrap">
                {prefix && (
                    <motion.h1 
                        className="text-3xl md:text-6xl text-text-main font-bold tracking-tight whitespace-nowrap pr-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                    >
                        {prefix}
                    </motion.h1>
                )}
                <div className="relative inline-flex items-center justify-center px-2 py-4 max-w-full">
                    <div className="absolute inset-0">
                        <motion.svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 600 200"
                            initial="hidden"
                            animate="visible"
                            className="w-full h-full overflow-visible"
                            preserveAspectRatio="none"
                        >
                            <title>Admyra</title>
                            <motion.path
                                d="M 540 60 
                                   C 620 100, 580 150, 300 150
                                   C 20 150, -20 100, 60 60
                                   C 120 10, 480 10, 540 60
                                   C 580 80, 600 120, 600 120"
                                fill="none"
                                strokeWidth="10"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                variants={draw}
                                className="text-primary-start/40"
                            />
                        </motion.svg>
                    </div>
                    <motion.h1
                        className="relative z-10 text-3xl md:text-6xl text-text-main font-bold tracking-tight whitespace-nowrap"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        {title}
                    </motion.h1>
                </div>
            </div>
            {subtitle && (
                <motion.p
                    className="text-base md:text-lg text-text-muted mt-2 max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}

export { HandWrittenTitle };
