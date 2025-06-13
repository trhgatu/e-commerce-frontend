import { useParams } from "react-router-dom"

export const DetailPermissionPage = () => {
    const {id } = useParams()
    return (
        <>
        Trang chi tiết của id {id}
        </>
    )
}