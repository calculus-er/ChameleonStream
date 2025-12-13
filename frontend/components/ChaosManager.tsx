'use client';

import { useEffect, useRef } from 'react';

export default function ChaosManager() {
    const isChaos = useRef(false);
    const cursorInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initial check
        const checkState = () => {
            isChaos.current = document.body.classList.contains('chaos-mode');
            updateEffects();
        };

        // Listen for toggle
        const handleToggle = (e: any) => {
            isChaos.current = e.detail.enabled;
            updateEffects();
        };

        window.addEventListener('chaosModeChanged', handleToggle);
        checkState();

        return () => {
            window.removeEventListener('chaosModeChanged', handleToggle);
            cleanupEffects();
        };
    }, []);

    const updateEffects = () => {
        if (isChaos.current) {
            enableEffects();
        } else {
            disableEffects();
        }
    };

    const enableEffects = () => {
        // 1. Theme is handled by CSS class .chaos-mode

        // 2. Screen Shake on Scroll
        window.addEventListener('scroll', handleScrollShake);

        // 3. Custom Cursor & Sparkles
        startCursorEffects();

        // 4. Inverted Scroll
        window.addEventListener('wheel', handleInvertedScroll, { passive: false });

        // 5. Chameleon Spawn on Click
        window.addEventListener('click', handleChameleonSpawn);

        // 6. Sparkle Trail
        window.addEventListener('mousemove', handleSparkleTrail);
    };

    const disableEffects = () => {
        window.removeEventListener('scroll', handleScrollShake);
        window.removeEventListener('wheel', handleInvertedScroll);
        window.removeEventListener('click', handleChameleonSpawn);
        window.removeEventListener('mousemove', handleSparkleTrail);
        stopCursorEffects();

        // Reset transforms
        document.body.style.transform = '';
        document.body.style.cursor = '';
    };

    const cleanupEffects = () => {
        disableEffects();
    };

    // --- Effect 2: Screen Shake ---
    let shakeTimeout: NodeJS.Timeout;
    const handleScrollShake = () => {
        if (!isChaos.current) return;

        const x = (Math.random() - 0.5) * 10; // Increased shake
        const y = (Math.random() - 0.5) * 10;

        document.body.style.transform = `translate(${x}px, ${y}px)`;

        clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
            document.body.style.transform = 'translate(0, 0)';
        }, 100);
    };

    // --- Effect 3: Random Cursor Size & Visibility ---
    const startCursorEffects = () => {
        createCustomCursor();

        if (cursorInterval.current) return;

        cursorInterval.current = setInterval(() => {
            if (!isChaos.current) return;
            // Smoothly pulse between 1x and 2.5x
            const scale = 1.0 + Math.random() * 1.5;
            const cursor = document.getElementById('chaos-cursor');
            if (cursor) {
                // Use CSS transition (defined below) for smoothness
                cursor.style.transform = `scale(${scale}) rotate(-20deg)`;
            }
        }, 800);
    };

    const stopCursorEffects = () => {
        if (cursorInterval.current) {
            clearInterval(cursorInterval.current);
            cursorInterval.current = null;
        }
        const cursor = document.getElementById('chaos-cursor');
        if (cursor) cursor.remove();
        document.documentElement.style.cursor = '';
    };

    const createCustomCursor = () => {
        if (document.getElementById('chaos-cursor')) return;

        // Use an SVG arrow directly
        const cursor = document.createElement('div');
        cursor.id = 'chaos-cursor';
        cursor.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3.5L19 12L5.5 20.5V3.5Z" fill="black" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        `;

        Object.assign(cursor.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '32px',
            height: '32px',
            pointerEvents: 'none',
            zIndex: '2147483647',
            transition: 'transform 0.5s ease-in-out, top 0.05s, left 0.05s', // Smooth scale, fast move
            transformOrigin: 'top left',
            transform: 'scale(1) rotate(-20deg)',
        });

        document.body.appendChild(cursor);
        document.documentElement.style.cursor = 'none';

        const moveCursor = (e: MouseEvent) => {
            if (!isChaos.current) return;
            // Point of cursor should be at mouse position
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };
        window.addEventListener('mousemove', moveCursor);
    };

    // --- Effect 4: Inverted Scroll ---
    const handleInvertedScroll = (e: WheelEvent) => {
        if (!isChaos.current) return;
        e.preventDefault();
        window.scrollBy({
            top: -e.deltaY,
            left: -e.deltaX,
            behavior: 'auto'
        });
    };

    // --- Effect 5: Chameleon Spawn ---
    const handleChameleonSpawn = (e: MouseEvent) => {
        if (!isChaos.current) return;

        const target = e.target as HTMLElement;
        if (target.closest('button') || target.closest('[aria-label="Toggle Chaos Mode"]')) return;

        const img = document.createElement('img');
        img.src = '/chameleon.png';
        Object.assign(img.style, {
            position: 'fixed',
            left: `${e.clientX - 50}px`,
            top: `${e.clientY - 50}px`,
            width: '100px',
            pointerEvents: 'none',
            zIndex: '10000',
            transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: `rotate(${Math.random() * 360}deg) scale(0)`,
            opacity: '1'
        });

        document.body.appendChild(img);

        requestAnimationFrame(() => {
            img.style.transform = `rotate(${Math.random() * 360}deg) scale(${1 + Math.random()})`;
        });

        setTimeout(() => {
            img.style.opacity = '0';
            img.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
            setTimeout(() => img.remove(), 500);
        }, 800);
    };

    // --- Effect 6: Sparkle Trail (Now BLACK) ---
    const handleSparkleTrail = (e: MouseEvent) => {
        if (!isChaos.current) return;

        if (Math.random() > 0.4) return;

        const sparkle = document.createElement('div');
        Object.assign(sparkle.style, {
            position: 'fixed',
            left: `${e.clientX}px`,
            top: `${e.clientY}px`,
            width: '8px',
            height: '8px',
            backgroundColor: 'black', // Black trail
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '2147483646',
            border: '1px solid white', // White border for contrast on black/yellow
            transition: 'all 0.6s ease-out',
            opacity: '1'
        });

        document.body.appendChild(sparkle);

        requestAnimationFrame(() => {
            const destX = (Math.random() - 0.5) * 60;
            const destY = (Math.random() - 0.5) * 60;
            sparkle.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
            sparkle.style.opacity = '0';
        });

        setTimeout(() => sparkle.remove(), 600);
    };

    return null;
}
