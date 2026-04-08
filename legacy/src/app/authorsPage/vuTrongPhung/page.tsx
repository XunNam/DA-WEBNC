import { Metadata } from "next"
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder"

export const metadata: Metadata = {
    title: "Tác giả | Vũ Trọng Phụng",
    description: "Tiểu sử Vũ Trọng Phụng"
}

export default function VuTrongPhung() {
    return (
        <div className={`flex justify-center items-center m-[50px]`}>
            <AuthorPagePlaceHolder 
            image="/author/vu-trong-phung.jpg"
            name="Vũ Trọng Phụng"
            dateOfBrith="1912 - 1939 (26 tuổi)"
            text1={`Vũ Trọng Phụng (1912-1939) là một nhà văn, nhà báo nổi tiếng của Việt Nam vào đầu thế kỷ 20. 
                Tuy thời gian cầm bút rất ngắn ngủi, với tác phẩm đầu tay là truyện ngắn Chống nạng lên đường đăng 
                trên Ngọ báo vào năm 1930, ông đã để lại một kho tác phẩm đáng kinh ngạc: hơn 30 truyện ngắn, 9 tập 
                tiểu thuyết, 9 tập phóng sự, 7 vở kịch, cùng một bản dịch vở kịch từ tiếng Pháp, một số bài viết phê
                 bình, tranh luận văn học và hàng trăm bài báo viết về các vấn đề chính trị, xã hội, văn hóa. Một số 
                 trích đoạn tác phẩm của ông trong các tác phẩm Số đỏ và Giông Tố đã được đưa vào sách giáo khoa môn
                  Ngữ văn của Việt Nam.`}
            text2={`Nổi tiếng với giọng văn trào phúng châm biếm xã hội của mình, một số người đã so sánh ông như 
                Balzac của Việt Nam. Tuy nhiên, cũng vì phong cách "tả chân" và yếu tố tình dục trong tác phẩm mà 
                khi sinh thời ông đã bị chính quyền bảo hộ Pháp tại Hà Nội gọi ra tòa vì "tội tổn thương phong hóa" 
                (outrage aux bonnes moeurs). Về sau này, tác phẩm của ông lại bị cấm xuất bản vì là "tác phẩm suy đồi" 
                tại miền Bắc Việt Nam từ năm 1954 và cả nước từ ngày 30 tháng 4 năm 1975 cho đến tận cuối những năm 1980 
                mới được chính quyền cho lưu hành.`}
            text3={`Vũ Trọng Phụng sinh ngày 20 tháng 10 năm 1912, quê ở làng Hảo (trước đây thuộc làng cổ Liêu 
                Xuyên mảnh đất địa linh sinh ra nhiều nhân tài) nay là thôn Ông Hảo, xã Liêu Xá, huyện Yên Mỹ, 
                tỉnh Hưng Yên nhưng ông lớn lên và qua đời tại Hà Nội. Cha ông là Vũ Văn Lân làm thợ điện ở Ga-ra 
                Charles Boillot, mất sớm khi ông mới được 7 tháng tuổi, Vũ Trọng Phụng được mẹ là bà Phạm Thị Khách 
                ở vậy tần tảo nuôi con ăn học. Sau khi học hết tiểu học tại trường Hàng Vôi, Vũ Trọng Phụng phải 
                thôi học để đi làm kiếm sống vào khoảng năm 16 tuổi. Ông là một trong những lứa thanh niên Việt Nam 
                đầu tiên được giáo dục bằng tiếng Pháp và chữ Quốc Ngữ. Đó là nguyên nhân khiến ông luôn thần tượng 
                nền văn hóa Pháp và là lớp nhà văn tích cực truyền bá văn học chữ Quốc Ngữ. Sau hai năm làm ở các sở 
                tư như nhà hàng Gôđa, nhà in IDEO (Viễn Đông), ông chuyển hẳn sang làm báo, viết văn chuyên nghiệp.`}
            text4={`Năm 1930, Vũ Trọng Phụng đã có truyện ngắn đầu tay Chống nạng lên đường đăng trên tờ Ngọ Báo. 
                Bắt đầu ông viết một số truyện ngắn, nhưng không được chú ý nhiều. Năm 1931, ông viết vở kịch Không 
                một tiếng vang, thì bắt đầu thu hút được sự quan tâm của độc giả. Năm 1934, Vũ Trọng Phụng mới cho ra 
                mắt cuốn tiểu thuyết tâm lý đầu tay Dứt tình đăng trên tờ Hải Phòng tuần báo.`}
            readMore="Đọc thêm (Wikipedia)"
            linkExternal="https://vi.wikipedia.org/wiki/V%C5%A9_Tr%E1%BB%8Dng_Ph%E1%BB%A5ng"
            />
        </div>
    )
}