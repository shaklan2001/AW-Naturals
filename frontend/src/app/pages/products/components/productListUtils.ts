import type { StorefrontProduct } from '../../../api/public-api';
import type { Product } from '../../../context/CartContext';

export function toCartProduct(p: StorefrontProduct): Product {
    return {
        id: p.id,
        name: p.name,
        shortDescription: p.shortDescription,
        benefit: p.benefit,
        description: p.description,
        price: p.price,
        image: p.image,
        status: p.status,
    };
}
