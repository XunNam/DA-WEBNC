import { Metadata } from "next";
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder";

export const metadata: Metadata = {
  title: "Tác giả | Nguyễn Tuân",
  description: "Tiểu sử Nguyễn Tuân",
};

export default function NguyenTuan() {
  return (
    <div className={`flex justify-center items-center m-[50px]`}>
      <AuthorPagePlaceHolder
        image="/author/nguyen-tuan.jpg"
        name="Nguyễn Tuân"
        dateOfBrith="1910 - 1987 (77 tuổi)"
        text1={`Nguyễn Tuân (10 tháng 7 năm 1910 – 28 tháng 7 năm 1987) là một nhà văn người Việt Nam.
        Nguyễn Tuân có sở trường về tùy bút và ký. Ông viết văn với một phong cách tài hoa uyên bác và được xem 
        là bậc thầy trong việc sáng tạo và sử dụng tiếng Việt. Các tác phẩm của Nguyễn Tuân luôn thể hiện phong 
        cách độc đáo, tài hoa, sự hiểu biết phong phú trong nhiều lĩnh vực và vốn ngôn ngữ giàu có, điêu luyện. 
        Sách giáo khoa hiện hành xếp ông vào một trong 9 tác giả tiêu biểu của văn học Việt Nam hiện đại.`}
        text2={`Nguyễn Tuân sinh ngày 10 tháng 7 năm1910 ở phố Hàng Bạc, Hà Nội. Quê ông ở thôn Thượng Đình, 
        xã Nhân Mục (tên nôm là làng Mọc), huyện Hoàn Long, Hà Nội, nay thuộc phường Nhân Chính, quận Thanh Xuân. 
        Ông trưởng thành trong một gia đình nhà Nho khi Hán học đã tàn.`}
        text3={`Nguyễn Tuân học đến cuối bậc Thành chung Nam Định (tương đương với cấp Trung học cơ sở hiện nay, 
            tiền thân của trường THPT Chuyên Lê Hồng Phong, Nam Định ngày nay) thì bị đuổi vì tham gia một cuộc bãi 
            khóa phản đối giáo viên Pháp nói xấu người Việt (1929). Sau đó ít lâu ông lại bị tù vì đi qua biên giới 
            tới Thái Lan không có giấy phép. Sau khi ra tù, ông bắt đầu sự nghiệp viết lách của mình.`}
        text4={`Nguyễn Tuân cầm bút từ khoảng đầu những năm 1935, nhưng nổi tiếng từ năm 1938 với các tác 
            phẩm tùy bút, bút ký có phong cách độc đáo như Vang bóng một thời, Một chuyến đi... Năm 1941, ông 
            lại bị bắt giam một lần nữa và gặp gỡ, tiếp xúc với những người hoạt động chính trị.`}
        readMore="Đọc thêm (Wikipedia)"
        linkExternal="https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Tu%C3%A2n"
      />
    </div>
  );
}
