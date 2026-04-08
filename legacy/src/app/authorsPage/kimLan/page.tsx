import { Metadata } from "next"
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder"

export const metadata: Metadata = {
    title: "Tác giả | Kim Lân",
    description: "Tiểu sử Kim Lân"
}


export default function KimLan() {
    return (
        <div className={`flex justify-center items-center m-[50px]`}>
            <AuthorPagePlaceHolder
            image="/author/kim-lan.jpg"
            name="Kim Lân"
            dateOfBrith="1920 - 2007 (86 tuổi)"
            text1="Nguyễn Văn Tài (1 tháng 8 năm 1920 - 20 tháng 7 năm 2007), 
            thường được biết đến với bút danh Kim Lân, là một nhà văn, diễn viên Việt Nam. Ông 
            được biết đến với các tác phẩm văn học như Vợ nhặt, Làng. Ngoài ra ông cũng được biết 
            đến qua vai diễn Lão Hạc trong phim Làng Vũ Đại ngày ấy."
            text2="Ông quê ở làng Phù Lưu, xã Tân Hồng, huyện Từ Sơn (nay thuộc phường Đông Ngàn, 
            thành phố Từ Sơn), tỉnh Bắc Ninh. Do hoàn cảnh gia đình khó khăn, ông chỉ được học hết 
            bậc tiểu học rồi phải đi làm. Kim Lân bắt đầu viết truyện ngắn từ năm 1941. Tác phẩm của 
            ông được đăng trên các báo Tiểu thuyết thứ bảy và Trung Bắc chủ nhật. Một số truyện (Vợ 
            nhặt, Đứa con người vợ lẽ, Đứa con người cô đầu và Cô Vịa) mang tính chất tự truyện nhưng 
            đã thể hiện được không khí tiêu điều, ảm đạm của nông thôn Việt Nam và cuộc sống lam lũ, vất 
            vả của người nông dân thời kỳ đó. Bút danh Kim Lân của ông được lấy từ tên của nhân vật Đổng 
            Kim Lân trong Tuồng Sơn Hậu, một vai ông đã từng diễn."
            text3="Ông được dư luận chú ý nhiều hơn khi đi vào những đề tài độc đáo như tái hiện sinh 
            hoạt văn hóa phong phú ở thôn quê (đánh vật, chọi gà và thả chim). Các truyện: Đôi chim thành, 
            Con mã mái, Chó săn... kể lại một cách sinh động những thú chơi kể trên, qua đó biểu hiện một phần 
            vẻ đẹp tâm hồn của người nông dân trước Cách mạng tháng Tám - những người sống cực nhọc, khổ nghèo 
            nhưng vẫn yêu đời, trong sáng, tài hoa."
            text4="Sau Cách mạng tháng Tám, Kim Lân tiếp tục làm báo, viết văn. Ông vẫn chuyên về truyện ngắn 
            và vẫn viết về làng quê Việt Nam - mảng hiện thực mà từ lâu ông đã hiểu biết sâu sắc. Những tác phẩm 
            chính: Nên vợ nên chồng (tập truyện ngắn, 1955), Con chó xấu xí (tập truyện ngắn, 1962). Sinh thời ông 
            sống tại Hà Nội. Nǎm 2001, Kim Lân được trao tặng Giải thưởng Nhà nước về văn học nghệ thuật. Ông từ 
            trần năm 2007 tại Bệnh viện Hữu Nghị Hà Nội, sau một thời gian dài chống chọi với căn bệnh hen suyễn, 
            hưởng thọ 86 tuổi."
            readMore="Đọc thêm (Wikipedia)"
            linkExternal="https://vi.wikipedia.org/wiki/Kim_L%C3%A2n"
            />
        </div>
    )
}