import { ABOUT_ORBIT_LAYOUT } from './aboutConstants';

const { DURATION_SEC } = ABOUT_ORBIT_LAYOUT;

/** Injected <style> for offset-path animation (ellipse path passed in). */
export function buildAboutOrbitStyleBlock(orbitPath: string): string {
    return `
        @keyframes about-orbit-dist {
            from { offset-distance: 0%; }
            to { offset-distance: 100%; }
        }
        @-webkit-keyframes about-orbit-dist {
            from { -webkit-offset-distance: 0%; }
            to { -webkit-offset-distance: 100%; }
        }
        .about-orbit-layer {
            offset-path: ${orbitPath};
            -webkit-offset-path: ${orbitPath};
            offset-rotate: 0deg;
            -webkit-offset-rotate: 0deg;
            offset-anchor: center;
            -webkit-offset-anchor: center;
            animation: about-orbit-dist ${DURATION_SEC}s linear infinite;
            -webkit-animation: about-orbit-dist ${DURATION_SEC}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
            .about-orbit-layer {
                animation: none !important;
                -webkit-animation: none !important;
            }
        }
    `.trim();
}
