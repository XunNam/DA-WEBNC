import { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { Open_Sans } from "next/font/google";
import BookPlaceHolder from "../components/body/bestSellingBooks/BookPlaceHolder";

export const metadata: Metadata = {
  title: "Bookstore | Sách",
  description: "Trang bán sách"
}

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

export default function BookPage() {
  return (
    <div className={`flex flex-col justify-center items-center`}>
      <div>
        <p className={`${ebGaramond.className}
        font-bold text-[40px] my-[50px]`}>Sách</p>
      </div>
      <div className={`flex flex-col 2xl:flex-row 2xl:gap-x-[100px]`}>
        <div className={`flex flex-col md:flex-row md:gap-x-[100px]`}>
          <BookPlaceHolder 
          image="/books/tat-den.webp"
          type="Tiểu thuyết"
          bookName="Tắt đèn"
          author="Ngô Tất Tố"
          price="75.000 VNĐ"
          />
          <BookPlaceHolder 
          image="/books/vo-nhat.webp"
          type="Truyện ngắn"
          bookName="Vợ nhặt"
          author="Kim Lân"
          originPrice="78.000 VNĐ"
          price="45.000 VNĐ"
          />
        </div>
        <div className={`flex flex-col md:flex-row md:gap-x-[100px]`}>
        <BookPlaceHolder 
          image="/books/chi-pheo.webp"
          type="Truyện ngắn"
          bookName="Chí Phèo"
          author="Nam Cao"
          price="38.400 VNĐ"
          />
          <BookPlaceHolder 
          image="/books/truyen-kieu.jpg"
          type="Truyện thơ"
          bookName="Truyện Kiều"
          author="Nguyễn Du"
          price="47.600 VNĐ"
          />
        </div>
      </div>
      <div className={`flex flex-col 2xl:flex-row 2xl:gap-x-[100px]`}>
        <div className={`flex flex-col md:flex-row md:gap-x-[100px]`}>
          <BookPlaceHolder 
          image="/books/so-do.webp"
          type="Tiểu thuyết"
          bookName="Số đỏ"
          author="Vũ Trọng Phụng"
          price="55.200 VNĐ"
          />
          <BookPlaceHolder 
          image="/books/canh-dong-bat-tan.jpg"
          type="Tiểu thuyết"
          bookName="Cánh đồng bất tận"
          author="Nguyễn Ngọc Tư"
          originPrice="69.700 VNĐ"
          price="63.000 VNĐ"
          />
        </div>
        <div className={`flex flex-col md:flex-row md:gap-x-[100px]`}>
        <BookPlaceHolder 
          image="/books/doi-thua.jpg"
          type="Truyện ngắn"
          bookName="Đời thừa"
          author="Nam Cao"
          originPrice="33.600 VNĐ"
          price="29.400 VNĐ"
          />
          <BookPlaceHolder 
          image="/books/vang-bong-mot-thoi.webp"
          type="Truyện ngắn"
          bookName="Vang bóng một thời"
          author="Nguyễn Tuân"
          price="58.000 VNĐ"
          />
        </div>
      </div>
      <div className={`flex flex-col 2xl:flex-row 2xl:gap-x-[100px]`}>
        <div className={`flex flex-col md:flex-row md:gap-x-[100px]`}>
          <BookPlaceHolder 
          image="/home/cho-toi-xin-mot-ve-di-tuoi-tho.jpg"
          type="Truyện ngắn"
          bookName="Cho tôi xin một vé đi tuổi thơ"
          author="Nguyễn Nhật Ánh"
          price="73.800 VNĐ"
          />
          <BookPlaceHolder 
          image="/home/cam-on-nguoi-lon.jpg"
          type="Truyện dài"
          bookName="Cảm ơn người lớn"
          author="Nguyễn Nhật Ánh"
          price="220.000 VNĐ"
          />
        </div>
        <div className={`flex flex-col md:flex-row md:gap-x-[100px]`}>
        <BookPlaceHolder 
          image="/home/toi-la-beto.jpg"
          type="Truyện ngắn"
          bookName="Tôi là Bêtô"
          author="Nguyễn Nhật Ánh"
          originPrice="67.000 VNĐ"
          price="65.000 VNĐ"
          />
          <BookPlaceHolder 
          image="/home/toi-thay-hoa-vang-tren-co-xanh.jpg"
          type="Tiểu thuyết"
          bookName="Tôi thấy hoa vàng trên cỏ xanh"
          author="Nguyễn Nhật Ánh"
          originPrice="93.000 VNĐ"
          price="81.000 VNĐ"
          />
        </div>
      </div>
    </div>
  );
}
