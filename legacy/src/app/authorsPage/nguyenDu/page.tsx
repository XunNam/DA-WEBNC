import { Metadata } from "next";
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder";

export const metadata: Metadata = {
  title: "Tác giả | Nguyễn Du",
  description: "Tiểu sử Nguyễn Du",
};

export default function NguyenDu() {
  return (
    <div className={`flex justify-center items-center m-[50px]`}>
      <AuthorPagePlaceHolder
        image="/author/nguyen-du.jpg"
        name="Nguyễn Du"
        dateOfBrith="1766 - 1820 (54 tuổi)"
        text1={`Nguyễn Du (chữ Hán: 阮攸; 3 tháng 1 năm 1766 – 16 tháng 9 năm 1820) tên tự là Tố Như (素如), hiệu là Thanh Hiên (清軒), biệt hiệu là Hồng Sơn lạp hộ (鴻山獵戶), Nam Hải điếu đồ (南海釣屠), là một nhà thơ, nhà văn hóa lớn thời Lê mạt Nguyễn sơ ở Việt Nam. Ông được người Việt kính trọng tôn xưng là "Đại thi hào dân tộc" và được UNESCO vinh danh là "Danh nhân văn hóa thế giới". Tác phẩm Truyện Kiều của ông được xem là một kiệt tác văn học, một trong những thành tựu tiêu biểu nhất trong nền văn học trung đại Việt Nam.`}
        text2={`Theo một bản gia phả của dòng họ Nguyễn ở huyện Nghi Xuân, Nguyễn Du sinh ngày 23 tháng 11 năm Ất Dậu (tức ngày 3 tháng 1 năm 1766 theo lịch Gregory; một số tài liệu ghi 1765) tại làng Tiên Điền, Nghi Xuân, Hà Tĩnh.

Cha của Nguyễn Du là Nguyễn Nghiễm (1708 – 1775), sinh ở làng Tiên Điền, huyện Nghi Xuân, Hà Tĩnh, tên tự Hy Tư, hiệu Nghị Hiên, biệt hiệu là Hồng Ngự cư sĩ, đậu Nhị giáp tiến sĩ, làm quan đến chức Đại Tư đồ (Tể tướng), tước Xuân Quận công. Mẹ là bà Trần Thị Tần (24/8/1740 – 27/8/1778), con gái một người làm chức Câu kế. Bà Tần quê ở làng Hoa Thiều, xã Minh Đạo, huyện Tiên Du (Đông Ngàn), xứ Kinh Bắc, nay thuộc tỉnh Bắc Ninh. Bà Tần là vợ thứ ba của Nguyễn Nghiễm (kém chồng 32 tuổi, sinh được 5 con, bốn trai và một gái). Tổ tiên của Nguyễn Du, quê nội ở làng Tảo Dương, quê ngoại ở làng Canh Hoạch, huyện Thanh Oai, trấn Sơn Nam (nay thuộc Hà Nội), nổi tiếng với câu chuyện Trạng Cậu, Trạng Cháu (Trạng nguyên Nguyễn Đức Lượng và Trạng nguyên Nguyễn Thiến). Về sau, Nam Dương công Nguyễn Doãn Miện (tức Nguyễn Nhiệm, là cháu của Trạng nguyên Nguyễn Thiến) di cư vào Hà Tĩnh, trở thành vị tổ phụ của dòng họ Nguyễn Tiên Điền.

`}
        text3={`Năm Quý Hợi (1803), khi vua Gia Long ra Bắc, Nguyễn Du từ Quỳnh Hải đem quân lương đi đón vua Gia Long, đến Phù Dung, trấn Sơn Nam Thượng thì gặp vua Gia Long, vua phong ngay tri huyện Phù Dung, phủ Khoái Châu, trấn Sơn Nam (nay là huyện Phù Cừ, tỉnh Hưng Yên). Sự kiện này giống như Phi Tử đời Chiến Quốc dâng ngựa cho vua Chu Hiếu Vương mà được chức Phụ Dung, nên Nguyễn Du có danh hiệu là Phi Tử.`}
        text4={`Qua các tác phẩm của Nguyễn Du, nét nổi bật chính là sự đề cao xúc cảm. Nguyễn Du là nhà thơ có học vấn uyên bác, nắm vững nhiều thể thơ của Trung Quốc như: ngũ ngôn cổ thi, ngũ ngôn luật, thất ngôn luật, ca, hành,... nên ở thể thơ nào, ông cũng có bài xuất sắc. Đặc biệt hơn cả là tài làm thơ bằng chữ Nôm của ông, mà đỉnh cao là Truyện Kiều, đã cho thấy thể thơ lục bát có khả năng chuyển tải nội dung tự sự và trữ tình to lớn trong thể loại truyện thơ.

`}
        readMore="Đọc thêm (Wikipedia)"
        linkExternal="https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n_Du"
      />
    </div>
  );
}
