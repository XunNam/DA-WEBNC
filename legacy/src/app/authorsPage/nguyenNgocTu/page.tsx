import { Metadata } from "next"
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder"

export const metadata: Metadata = {
    title: "Tác giả | Nguyễn Ngọc Tử",
    description: "Tiểu sử Nguyễn Ngọc Tử"
}

export default function NguyenNgocTu() {
    return (
        <div className={`flex justify-center items-center m-[50px]`}>
            <AuthorPagePlaceHolder
            image="/author/nguyen-ngoc-tu.jpg"
            name="Nguyễn Ngọc Tư"
            dateOfBrith="1976 - Nay (48 tuổi)"
            text1={`Nguyễn Ngọc Tư (sinh năm 1976 tại xã Tân Duyệt, 
                huyện Đầm Dơi, tỉnh Cà Mau) là một nhà văn, thành 
                viên Hội nhà văn Việt Nam. Năm 2018, cô được trao 
                Giải thưởng Văn học Liberaturpreis 2018 do Litprom 
                (Hiệp hội quảng bá văn học châu Á, châu Phi, Mỹ Latin 
                ở Đức) bình chọn, dựa trên việc xem xét các bản dịch 
                tiếng Đức tác phẩm nổi bật của các tác giả nữ đương đại 
                tiêu biểu trong khu vực. Giải thưởng được trao hàng năm 
                nhằm vinh danh các tác giả nữ đến từ châu Á, Phi, Mỹ Latin
                , Các tiểu vương quốc Ả Rập thống nhất (UAE) và vùng Caribe.`}
            text2={`Nguyễn Ngọc Tư sinh năm 1976 tại xã Tân Duyệt, huyện Đầm 
                Dơi, tỉnh Cà Mau trong một gia đình nông dân. Cô học hết cấp 
                Phổ Thông Cơ Sở đã nghỉ học, mong muốn xin làm việc tại một cơ 
                quan văn nghệ báo chí tỉnh Cà Mau, môi trường thuận tiện có thể 
                phát triển nghề cầm bút mà cô đam mê. Các truyện ngắn đầu tay 
                của Nguyễn Ngọc Tư viết về tình bạn ở đồng quê, được ba cô gửi tạp 
                chí Văn nghệ Bán đảo Cà Mau và đã được đăng. Cô đã kết hôn và cũng 
                đã có con.`}
            readMore="Đọc thêm (Wikipedia)"
            linkExternal="https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Ng%E1%BB%8Dc_T%C6%B0"
            />
        </div>
    )
}