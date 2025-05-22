const ROUTERS = {
    ADMIN: {
        root: "/admin",
        dashboard: "/admin/dashboard",
        users: {
            root: "/admin/users",
            create: "/admin/users/create",
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
            trash: "/admin/categories/trash-bin"
        },
        brands: {
            root: "/admin/brands",
            create: "/admin/brands/create",
            trash: "/admin/brands/trash-bin"
        },
        colors: {
            root: "/admin/colors",
            create: "/admin/colors/create",
            trash: "/admin/colors/trash-bin"
        }
    },
}
export default ROUTERS;