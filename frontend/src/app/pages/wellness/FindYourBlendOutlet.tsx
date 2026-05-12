import { Outlet } from 'react-router';

/** Parent route so `/find-your-blend` and `/find-your-blend/result` share one segment. */
export function FindYourBlendOutlet() {
    return <Outlet />;
}
