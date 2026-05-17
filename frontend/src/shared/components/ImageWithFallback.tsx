import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    alt = '',
    fallbackSrc = 'https://images.unsplash.com/photo-1611080626919-7cf5a9caab5b?q=80&w=800&auto=format&fit=crop',
    className,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setError(false);
    }, [src]);

    const handleError = () => {
        if (!error) {
            setImgSrc(fallbackSrc);
            setError(true);
        }
    };

    return (
        <img
            src={imgSrc || fallbackSrc}
            alt={alt}
            onError={handleError}
            className={className}
            {...props}
        />
    );
};
