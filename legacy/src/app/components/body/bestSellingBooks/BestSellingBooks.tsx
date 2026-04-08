import { EB_Garamond } from "next/font/google";
import { Open_Sans } from "next/font/google";
import BookPlaceHolder from "./BookPlaceHolder";

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const BestSellingBooks = () => {
  return (
    <div
      className={`${ebGaramond.className} w-full h-auto flex flex-col
      justify-center items-center relative`}
    >
      <div className={`flex flex-col justify-center items-center`}>
        <p className={`font-bold text-[40px]`}>Sách Bán Chạy</p>
        <p
          className={`${openSans.className} text-[#6e7279] mt-[10px] w-[400px] lg:w-[600px] text-center`}
        >
          Các tác phẩm văn học bán chạy nhất của chúng tôi
        </p>
      </div>
      <div className={`flex flex-col lg:flex-row gap-x-[100px] mt-[30px]`}>
        <div>
          <BookPlaceHolder
            image="/home/cho-toi-xin-mot-ve-di-tuoi-tho.jpg"
            type="Truyện ngắn"
            bookName="Cho tôi xin một vé đi tuổi thơ"
            author="Nguyễn Nhật Ánh"
            price="73.800 VNĐ"
          />
        </div>
        <div>
          <BookPlaceHolder
            image="/home/cam-on-nguoi-lon.jpg"
            type="Truyện dài"
            bookName="Cảm ơn người lớn"
            author="Nguyễn Nhật Ánh"
            price="220.000 VNĐ"
          />
        </div>
        <div>
          <BookPlaceHolder
            image="/home/toi-la-beto.jpg"
            type="Truyện ngắn"
            bookName="Tôi là Bêtô"
            author="Nguyễn Nhật Ánh"
            originPrice="67.000 VNĐ"
            price="65.000 VNĐ"
          />
        </div>
        <div>
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
};

export default BestSellingBooks;
