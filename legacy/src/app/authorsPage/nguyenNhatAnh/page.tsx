import { Metadata } from "next";
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder";

export const metadata: Metadata = {
  title: "Tác giả | Nguyễn Nhật Ánh",
  description: "Tiểu sử Nguyễn Nhật Ánh",
};

export default function NguyenNhatAnh() {
  return (
    <div className={`flex justify-center items-center m-[50px]`}>
      <AuthorPagePlaceHolder
        image="/author/nguyen-nhat-anh.jpg"
        name="Nguyễn Nhật Ánh"
        dateOfBrith="1955 - Nay (69 tuổi)"
        text1="Nguyễn Nhật Ánh (sinh ngày 7 tháng 5 năm 1955) là một nam nhà văn người Việt 
        Nam. Được xem là một trong những nhà văn hiện đại xuất sắc nhất Việt Nam hiện nay, 
        ông được biết đến qua nhiều tác phẩm văn học về đề tài tuổi trẻ. Nhiều tác phẩm của 
        ông được độc giả và giới chuyên môn đánh giá cao, đa số đều đã được chuyển thể thành phim."
        text2="Ông lần lượt viết về sân khấu, phụ trách mục tiểu phẩm, phụ trách trang thiếu 
        nhi và hiện nay là bình luận viên thể thao trên báo Sài Gòn Giải phóng Chủ nhật với 
        bút danh Chu Đình Ngạn. Ngoài ra, ông còn có những bút danh khác như Anh Bồ Câu, Lê 
        Duy Cật, Đông Phương Sóc, Sóc Phương Đông."
        text3="Nguyễn Nhật Ánh sinh ngày 7 tháng 5 năm 1955 tại làng Đo Đo, xã Bình Quế, 
        huyện Thăng Bình, tỉnh Quảng Nam. Thuở nhỏ ông theo học tại các trường THPT Tiểu La
        , THPT chuyên ban Trần Cao Vân và THCS Phan Châu Trinh. Từ năm 1973, ông chuyển vào 
        sống tại Sài Gòn, theo học ngành sư phạm. Ông đã từng tham gia Thanh niên xung phong,
         dạy học môn Văn tại trường THCS Bình Tây (Quận 6) từ năm 1983-1985."
        text4="Năm 13 tuổi, ông đăng báo bài thơ đầu tiên. Tác phẩm đầu tiên được in thành 
        sách là một tập thơ tên Thành phố tháng tư (Nhà xuất bản Tác phẩm mới, 1984, in chung
         với Lê Thị Kim). Truyện dài đầu tiên của ông là tác phẩm Trước vòng chung kết (Nhà 
         xuất bản Măng Non, 1984). Hơn hai mươi năm trở lại đây, ông tập trung viết văn 
         xuôi, chuyên sáng tác về đề tài thanh thiếu niên."
        readMore="Đọc thêm (Wikipedia)"
        linkExternal="https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Nh%E1%BA%ADt_%C3%81nh"
      />
    </div>
  );
}
