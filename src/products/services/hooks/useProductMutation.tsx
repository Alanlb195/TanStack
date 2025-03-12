import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, productActions } from '../..';

export const useProductMutation = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: productActions.createProduct,
        // onMutate: (product) => {
        //     const optimisticProduct = { id: Math.random(), ...product };
        //     queryClient.setQueryData<Product[]>(
        //         ['products', { filterKey: product.category }],
        //         (oldData) => {
        //             if (!oldData) return [optimisticProduct];
        //             return [...oldData, optimisticProduct];
        //         }
        //     );
        //     return { optimisticProduct }
        // },
        onSuccess: (product, _variables, _context) => {
            // option with invalidation
            queryClient.invalidateQueries({ queryKey: ['products', { filterKey: product.category }] })

            // option witout invalidation
            // queryClient.removeQueries({ queryKey: ['product', { id: context.optimisticProduct.id }], exact: true })

            queryClient.setQueryData<Product[]>(
                ['products', { filterKey: product.category }],
                (oldData) => {
                    if (!oldData) return [product];

                    // option witout invalidation
                    // return oldData.map(cacheProduct => {
                    //     return cacheProduct.id === context.optimisticProduct.id ? product : cacheProduct
                    // })

                    // option with invalidation
                    return [...oldData, product]
                }
            )
            // alert('Producto agregado exitosamente');
        },
        onError: (_error, _variables, _context) => {
            // option without invalidation
            // queryClient.removeQueries({ queryKey: ['product', { id: context?.optimisticProduct.id }], exact: true })
            // queryClient.setQueryData<Product[]>(
            //     ['products', { filterKey: variables.category }],
            //     (oldData) => {
            //         if (!oldData) return [];
            //         return oldData.filter(cacheProduct => {
            //             return cacheProduct.id !== context?.optimisticProduct.id
            //         })
            //     }
            // )
            // alert('Ocurrio un error al intentar agregar el producto: ' + error.message.toString());
        }
    })
    return mutation
}
