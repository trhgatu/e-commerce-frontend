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
        },
        categories: {
            root: "/admin/categories",
            create: "/admin/categories/create"
        },
        brands: {
            root: "/admin/brands",
            create: "/admin/brands/create"
        },
        colors: {
            root: "/admin/colors",
            create: "/admin/colors/create"
        }
    },
}
export default ROUTERS;