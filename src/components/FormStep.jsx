import { motion } from 'framer-motion';

export default function FormStep({ children, direction = 1, isIntro = false }) {
    const variants = {
        initial: (direction) => ({
            opacity: 0,
            x: direction > 0 ? 40 : -40,
            scale: 0.98
        }),
        animate: {
            opacity: 1,
            x: 0,
            scale: 1,
            // Faster spring animation for snappier feeling
            transition: { type: 'spring', stiffness: 500, damping: 25 }
        },
        exit: (direction) => ({
            opacity: 0,
            x: direction < 0 ? 40 : -40,
            scale: 0.98,
            // Faster exit
            transition: { duration: 0.15 }
        })
    };

    return (
        <motion.div
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={isIntro ? "intro-step-container" : "step-container"}
        >
            {children}
        </motion.div>
    );
}
