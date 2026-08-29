import { useEffect, useMemo } from "react";

function BubbleTransition({ onComplete }) {
    const bubbles = useMemo(() => {
        return Array.from({ length: 1500 }, (_, index) => {
            const size = Math.floor(Math.random() * 85) + 10;

            return {
                id: index,

                x: Math.random() * 110 - 5,
                y: Math.random() * 110 - 5,

                size,

                duration: 8,

                delay: Math.random() * 1.5,

                driftX: `${(Math.random() - 0.5) * 100}px`,
                driftY: `${(Math.random() - 0.5) * 100}px`,

                rotation: Math.random() * 360,
            };
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 9500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="bubble-transition">
            <div className="bubble-field">
                {bubbles.map((bubble) => (
                    <span
                        key={bubble.id}
                        className="storm-bubble"
                        style={{
                            "--x": `${bubble.x}%`,
                            "--y": `${bubble.y}%`,
                            "--size": `${bubble.size}px`,
                            "--duration": `${bubble.duration}s`,
                            "--delay": `${bubble.delay}s`,
                            "--drift-x": bubble.driftX,
                            "--drift-y": bubble.driftY,
                            "--rotation": `${bubble.rotation}deg`,
                        }}
                    >
                        <span className="sparkles">
                            <i>✦</i>
                            <i>✧</i>
                            <i>✦</i>
                            <i>✧</i>
                            <i>·</i>
                            <i>✦</i>
                        </span>
                    </span>
                ))}
            </div>

            <div className="transition-bunny">🐰</div>
        </div>
    );
}

export default BubbleTransition;