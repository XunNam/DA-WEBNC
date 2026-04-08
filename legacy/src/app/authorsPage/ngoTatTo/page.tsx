import { Metadata } from "next";
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder";

export const metadata: Metadata = {
  title: "Tác giả | Ngô Tất Tố",
  description: "Tiểu sử Ngô Tất Tố",
};

export default function NgoTatTo() {
  return (
    <div className={`flex justify-center items-center m-[50px]`}>
      <AuthorPagePlaceHolder
        image="/author/ngo-tat-to.jpg"
        name="Ngô Tất Tố"
        dateOfBrith="1893 - 1954 (60-61 tuổi)"
        text1="Ngô Tất Tố (吳必做, 1893 – 20 tháng 4 năm 1954) 
            là một nhà văn, nhà báo, nhà Nho học, dịch giả và nhà nghiên cứu
             có ảnh hưởng lớn ở Việt Nam giai đoạn trước 1954."
        text2="Ngô Tất Tố sinh năm 1893 (mất năm 1954) ở làng Lộc Hà, tổng Hội Phụ,
              phủ Từ Sơn, Bắc Ninh (nay là thôn Lộc Hà, xã Mai Lâm, huyện Đông Anh, Hà Nội). 
              Ông là con thứ hai, nhưng là trưởng nam trong một gia đình có bảy anh chị em, ba 
              trai, bốn gái. Lúc còn nhỏ Ngô Tất Tố được thụ hưởng một nền giáo dục Nho học. Từ năm
               1898, Ngô Tất Tố được ông nội dạy vỡ lòng chữ Hán ở quê, sau đó ông theo học ở nhiều
                làng quê trong vùng. Năm 1912, Ngô Tất Tố học tư chữ Pháp một thời gian ngắn và bắt
                 đầu tham dự các kỳ thi truyền thống lúc bấy giờ vẫn còn được triều đình nhà Nguyễn 
                 tổ chức. Ông đỗ kỳ sát hạch, nhưng thi hương bị hỏng ở kỳ đệ nhất. Đến năm 1915, ông 
                 đỗ đầu kỳ khảo hạch toàn tỉnh Bắc Ninh, nên được gọi là đầu xứ Tố, rồi thi hương lần 
                 thứ hai, khoa Ất Mão, cũng là khoa thi hương cuối cùng ở Bắc Kì. Ông qua được kỳ đệ nhất,
                  nhưng bị hỏng ở kỳ đệ nhị."
        text3="Ngô Tất Tố không chỉ là nhà văn mà còn là một nhà báo nổi tiếng. Các tác 
        giả nghiên cứu Di sản báo chí Ngô Tất Tố - ý nghĩa lý luận và thực tiễn đối với sự
         nghiệp phát triển báo chí thủ đô do Hội nhà báo thành phố Hà Nội thực hiện năm 2004 
         với người đứng đầu là giáo sư, nhà phê bình văn học Phan Cự Đệ cho biết họ tìm thấy 1.350
          tác phẩm (gần 4.500 trang) đã đăng báo của Ngô Tất Tố với 59 bút danh khác nhau. Năm 2005
          , tại hội thảo Những phát hiện mới về thân thế và tư cách nhà văn hóa của Ngô Tất Tố, một t
          hống kê khác được công bố cho biết trong 28 năm làm báo, Ngô Tất Tố đã viết gần 1.500 bài
           (mới tìm thấy 1.360 bài) cho 27 tờ báo và tạp chí với 29 bút danh."
        text4={"Ngô Tất Tố viết nhiều thể loại báo chí, trong đó tiểu phẩm và phóng sự là hai thể loại đã giúp ông thành danh. Ông còn phụ trách nhiều chuyên mục của nhiều tờ báo hàng ngày và hàng tuần. Nhà văn, nhà báo kỳ cựu Vũ Bằng, trong Mười bốn gương mặt nhà văn đồng nghiệp (Nhà xuất bản Hội nhà văn, Hà Nội, 2004), từng khẳng định \"Ngô Tất Tố là một huấn luyện viên của tôi trong nghề báo\". Di sản báo chí của Ngô Tất Tố trở thành những tư liệu phong phú, chi tiết, phản ánh toán diện và trung thực xã hội Việt Nam đầu thế kỷ XX. Các tác giả trong đề tài nghiên cứu nói trên kết luận rằng tiểu phẩm báo chí của Ngô Tất Tố đạt được năm thành tựu cơ bản: thuyết phục, truyền cảm, điển hình hóa mà không hư cấu; nghệ thuật trào lộng, đả kích và phong cách đậm đà bản sắc dân tộc. Về thái độ làm báo, Ngô Tất Tố được đánh giá là một nhà báo có dũng khí, trung thực, thẳng thắn, nhạy bén và cập nhật tình hình khẩn cấp"}
        readMore="Đọc thêm (Wikipedia)"
        linkExternal="https://vi.wikipedia.org/wiki/Ng%C3%B4_T%E1%BA%A5t_T%E1%BB%91"
      />
    </div>
  );
}
