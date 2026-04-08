import Adwards from "./components/body/adWards/Adwards";
import BestSellingBooks from "./components/body/bestSellingBooks/BestSellingBooks";
import Biography from "./components/body/bioGraphy/Biography";
import NewRelease from "./components/body/newRelease/NewRelease";
import { EB_Garamond } from "next/font/google";
import { Open_Sans } from "next/font/google";

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

export default function Home() {

  return (
    <div>
      <div className={`flex justify-center mt-[60px] w-full h-auto`}>
        <NewRelease />
      </div>
      <div className={`flex justify-center mt-[100px] w-full h-auto`}>
        <Biography />
      </div>
      <div className={`flex justify-center mt-[160px] w-full h-auto`}>
        <Adwards />
      </div>
      <div className={`flex justify-center mt-[100px] w-full h-auto mb-[90px]`}>
        <BestSellingBooks />
      </div>
      <div
        className={`flex flex-col justify-center items-center w-full h-[400px]
          bg-white text-center`}
      >
        <p
          className={`${ebGaramond.className} font-semibold text-[40px] text-[#25272d] lg:text-[50px]`}
        >
          Đăng ký để nhận thông tin mới nhất
        </p>
        <p
          className={`${openSans.className} w-[400px] text-center text-[#565a61] mt-[10px] text-[17px] lg:text-[20px] lg:w-[600px]`}
        >
          Nhận những thông tin mới nhất về sách, các ưu đãi, mã giảm giá và sử
          dụng ngay thôi nào.
        </p>
      </div>
    </div>
  );
}
