import PixelBlast from '../../../components/ui/pixel-blast';

export function ProductsAmbientBackground() {
    return (
        <div
            className="fixed inset-x-0 bottom-0 h-[60vh] z-0 opacity-20 pointer-events-none"
            style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%)',
                maskImage: 'linear-gradient(to bottom, transparent, black 40%)',
            }}
        >
            <PixelBlast color="#D4AF37" liquid={true} />
        </div>
    );
}
