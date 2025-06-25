const prefixAdmin = `/admin`;
const ROUTERS = {

    ADMIN: {
        root: prefixAdmin,
        dashboard: `${prefixAdmin}/dashboard`,
        users: {
            root: `${prefixAdmin}/users`,
            create: `${prefixAdmin}/users/create`,
            edit: (id: string) => `${prefixAdmin}/users/edit/${id}`,
            show: (id: string) => `${prefixAdmin}/users/detail/${id}`,
            trash: `${prefixAdmin}/users/trash-bin`
        },
        roles: {
            root: `${prefixAdmin}/roles`,
            permissions: `${prefixAdmin}/roles/permissions`,
            create: `${prefixAdmin}/roles/create`,
            edit: (id: string) => `${prefixAdmin}/roles/edit/${id}`,
            show: (id: string) => `${prefixAdmin}/roles/detail/${id}`,
            trash: `${prefixAdmin}/roles/trash-bin`
        },
        permissions: {
            root: `${prefixAdmin}/permissions`,
            create: `${prefixAdmin}/permissions/create`,
            edit: (id: string) => `${prefixAdmin}/permissions/edit/${id}`,
            show: (id: string) => `${prefixAdmin}/permissions/detail/${id}`,
            trash: `${prefixAdmin}/permissions/trash-bin`
        },
        products: {
            root: `${prefixAdmin}/products`,
            create: `${prefixAdmin}/products/create`,
            edit: (id: string) => `${prefixAdmin}/products/edit/${id}`,
            show: (id: string) => `${prefixAdmin}/products/detail/${id}`,
            trash: `${prefixAdmin}/products/trash-bin`
        },
        categories: {
            root: `${prefixAdmin}/categories`,
            create: `${prefixAdmin}/categories/create`,
            trash: `${prefixAdmin}/categories/trash-bin`,
            edit: (id: string) => `${prefixAdmin}/categories/edit/${id}`,
            show: (id: string) => `${prefixAdmin}/categories/detail/${id}`
        },
        brands: {
            root: `${prefixAdmin}/brands`,
            create: `${prefixAdmin}/brands/create`,
            trash: `${prefixAdmin}/brands/trash-bin`,
            show: (id: string) => `${prefixAdmin}/brands/detail/${id}`,
            edit: (id: string) => `${prefixAdmin}/brands/edit/${id}`
        },
        colors: {
            root: `${prefixAdmin}/colors`,
            create: `${prefixAdmin}/colors/create`,
            trash: `${prefixAdmin}/colors/trash-bin`
        },
        orders: {
            root: `${prefixAdmin}/orders`,

        },
        vouchers: {
            root: `${prefixAdmin}/vouchers`,
            create: `${prefixAdmin}/vouchers/create`,
            trash: `${prefixAdmin}/vouchers/trash-bin`,
            show: (id: string) => `${prefixAdmin}/vouchers/detail/${id}`,
            edit: (id: string) => `${prefixAdmin}/vouchers/edit/${id}`
        },
        inventories: {
            root: `${prefixAdmin}/inventories`,
            create: `${prefixAdmin}/inventories/create`,
            trash: `${prefixAdmin}/inventories/trash-bin`,
            show: (id: string) => `${prefixAdmin}/inventories/detail/${id}`,
            edit: (id: string) => `${prefixAdmin}/inventories/edit/${id}`
        }
    },
}
export default ROUTERS;