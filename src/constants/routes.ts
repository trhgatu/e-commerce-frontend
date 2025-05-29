const ROUTERS = {
    ADMIN: {
        root: "/admin",
        dashboard: "/admin/dashboard",
        users: {
            root: "/admin/users",
            create: "/admin/users/create",
        },
        roles: {
            root: "/admin/roles",
            create: "/admin/roles/create",
            edit: (id: string) => `/admin/roles/edit/${id}`,
            show: (id: string) => `/admin/roles/detail/${id}`,
            trash: "/admin/roles/trash-bin"
        },
        products: {
            root: "/admin/products",
            create: "/admin/products/create",
            show: (id: string) => `/admin/products/detail/${id}`,
            trash: "/admin/products/trash-bin"
        },
        categories: {
            root: "/admin/categories",
            create: "/admin/categories/create",
            trash: "/admin/categories/trash-bin",
            edit: (id: string) => `/admin/categories/edit/${id}`,
            show: (id: string) => `/admin/categories/detail/${id}`
        },
        brands: {
            root: "/admin/brands",
            create: "/admin/brands/create",
            trash: "/admin/brands/trash-bin",
            show: (id: string) => `/admin/brands/detail/${id}`,
            edit: (id: string) => `/admin/brands/edit/${id}`
        },
        colors: {
            root: "/admin/colors",
            create: "/admin/colors/create",
            trash: "/admin/colors/trash-bin"
        }
    },
}
export default ROUTERS;