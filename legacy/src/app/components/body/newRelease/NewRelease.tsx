import { Baloo_Paaji_2 } from "next/font/google";
import { EB_Garamond } from "next/font/google";
import Image from "next/image";
import BuyNow from "./BuyNow";
import ReadSample from "./ReadSample";

const balooPaaji2 = Baloo_Paaji_2({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const NewRelease = () => {
  return (
    <div
      className={`flex flex-col
    lg:flex-row-reverse lg:gap-x-[100px]`}
    >
      <div>
        <Image
          src="/home/ngay-xua-co-mot-chuyen-tinh.webp"
          width={400}
          height={0}
          alt="Bìa sách Ngày xưa có một chuyện tình "
          className={`rounded-xl`}
        ></Image>
      </div>
      <div>
        <div className={`mt-[30px]`}>
          <p
            className={`${balooPaaji2.className}
                font-semibold
                text-[20px]
                text-[#5f4ecb]`}
          >
            SÁCH MỚI
          </p>
        </div>
        <div
          className={`${ebGaramond.className}
        lg:w-[500px] lg:text-[70px]
        lg:font-medium lg:leading-[90px]
        w-[400px] h-auto
        flex justify-center
        text-[50px] font-bold
        text-start leading-[60px]
        mt-[20px] text-[#25272d]`}
        >
          <p>Ngày xưa có một chuyện tình</p>
        </div>
        <div
          className={`w-[400px] h-auto
        flex justify-center
        text-[18px] text-start
        mt-[30px] text-[#62666c]`}
        >
          <p>
            NGÀY XƯA CÓ MỘT CHUYỆN TÌNH là tác phẩm mới tinh thứ 2 trong năm
            2016 của nhà văn Nguyễn Nhật Ánh dài hơn 300 trang, được coi là tập
            tiếp theo của tập truyện Mắt biếc. Có một tình yêu dữ dội, với em,
            của một người yêu em hơn chính bản thân mình - là anh.
          </p>
        </div>
        <div className={`flex flex-row space-x-[30px] mt-[10px] relative`}>
          <div>
            <BuyNow />
          </div>
          <div>
            <ReadSample />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRelease;
