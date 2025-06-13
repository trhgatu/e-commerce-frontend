import { useParams } from "react-router-dom"

export const EditPermissionPage = () => {
    const {id} = useParams();
    return (
        <>
        Trang sửa quyền với id {id}
        </>
    )
}