import { Metadata } from "next";
import AuthorPagePlaceHolder from "../components/authorPagePlaceHolder";

export const metadata: Metadata = {
  title: "Tác giả | Nam Cao",
  description: "Tiểu sử Nam Cao",
};

export default function NamCao() {
  return (
    <div className={`flex justify-center items-center m-[50px]`}>
      <AuthorPagePlaceHolder
        image="/author/nam-cao.jpg"
        name="Nam Cao"
        dateOfBrith="1915 - 1951 (? tuổi)"
        text1="Nam Cao (nguyên danh Trần Hữu Tri, thánh danh Giuse, 
        29 tháng 10, năm 1915 hoặc 1917 – 30 tháng 11 năm 1951) là 
        một nhà văn, nhà thơ, nhà báo và cũng là một chiến sĩ, liệt 
        sĩ người Việt Nam. Ông là nhà văn hiện thực lớn (trước Cách 
        mạng Tháng Tám), một nhà báo kháng chiến (sau Cách mạng), một 
        trong những nhà văn tiêu biểu nhất thế kỷ 20. Nam Cao có nhiều 
        đóng góp quan trọng đối với việc hoàn thiện phong cách truyện 
        ngắn và tiểu thuyết Việt Nam ở nửa đầu thế kỷ 20."
        text2="Nam Cao tên khai sinh là Trần Hữu Tri (có nguồn ghi là 
        Trần Hữu Trí), sinh ngày 29 tháng 10 năm 1915 nhưng giấy 
        khai sinh ghi là 1917. Quê ông tại làng Đại Hoàng, tổng Cao 
        Đà, huyện Nam Sang, phủ Lý Nhân (nay là xã Hòa Hậu, huyện Lý Nhân, 
        tỉnh Hà Nam). Ông đã ghép hai chữ đầu tiên của tên tổng và huyện 
        làm bút danh: Nam Cao."
        text3={`Thuở nhỏ, Nam Cao học sơ học ở trường làng. Đến cấp tiểu học và bậc trung học, gia đình gửi ông xuống Nam Định học ở trường Cửa Bắc rồi trường Thành Chung (nay là trường Trung học phổ thông chuyên Lê Hồng Phong, Nam Định). 1934 học xong bậc trung học, nhưng bị ngã và đau ốm nên chưa thi lấy bằng Thành chung. Đầu năm 1935 cưới vợ, Trần Thị Sen (tên thánh Maria Sen), người cùng làng. Tháng 11/1935 Nam Cao vào Sài Gòn, ở lại đây 30 tháng, sống bằng nghề làm thư ký hiệu may Ba Lễ, đồng thời bắt đầu viết văn, gửi cho các báo. Năm 1936 được đăng các truyện ngắn "Cảnh cuối cùng" và "Hai cái xác" dưới bút danh Thúy Rư trên tuần báo Tiểu thuyết thứ bảy (Hà Nội). Năm 1937 được đăng các truyện ngắn "Một bà hào hiệp", "Nghèo", "Đui mù" dưới bút danh Thúy Rư trên Tiểu thuyết thứ bảy, Truyện "Những cánh hoa tàn" trên báo Ích Hữu (Hà Nội). Tháng 5 năm 1938, vì lí do sức khoẻ, Nam Cao trở ra Bắc, về quê.`}
        text4="Trở ra Bắc, sau khi tự học lại để thi lấy bằng Thành chung, 
        Nam Cao lên Hà Nội dạy học ở Trường tư thục Công Thanh, trên đường Thụy 
        Khuê, Hà Nội. Ông đưa in truyện ngắn Cái chết của con Mực trên báo Hà Nội 
        tân văn (1940) và in thơ cũng trên báo này với các bút danh Xuân Du, Nguyệt. 
        Năm 1941, tập truyện đầu tay Đôi lứa xứng đôi, tên trong bản thảo là Cái lò 
        gạch cũ, với bút danh Nam Cao do Nhà xuất bản Đời mới Hà Nội ấn hành được đón 
        nhận như là một hiện tượng văn học thời đó. Sau này khi in lại (1945), Nam Cao 
        đã đổi tên là Chí Phèo. Phát xít Nhật xâm chiếm Đông Dương, trường sở bị trưng 
        dụng, ông rời Hà Nội, về dạy học ở Trường tư thục Kỳ Giang, tỉnh Thái Bình, rồi 
        về lại làng quê Đại Hoàng. Thời kỳ này, Nam Cao cho ra đời nhiều tác phẩm. Ông 
        in truyện dài nhiều kỳ Truyện người hàng xóm trên tờ Trung Bắc Chủ nhật, viết 
        xong tiểu thuyết Chết mòn, sau đổi là Sống mòn."
        readMore="Đọc thêm (Wikipedia)"
        linkExternal="https://vi.wikipedia.org/wiki/Nam_Cao"
      />
    </div>
  );
}
