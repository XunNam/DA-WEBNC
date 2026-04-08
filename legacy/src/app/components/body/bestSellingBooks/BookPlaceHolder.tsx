import Image from "next/image";
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

type BookPlaceHolder = {
  image: string;
  type: string;
  bookName: string;
  author: string;
  price: string;
  originPrice?: string;
};

const BookPlaceHolder = ({
  image,
  type,
  bookName,
  author,
  price,
  originPrice,
}: BookPlaceHolder) => {
  return (
    <div>
      <div className={`mt-[50px] hover:before:bg-black/30 hover:before:backdrop-blur-md cursor-pointer
      before:contents-[''] before:absolute relative  before:inset-0 before:rounded-xl before:transition-all
      before:duration-[500ms] before:ease-in-out
      `}>
        <Image
          src={image}
          width={250}
          height={0}
          alt={`Bìa sách ${bookName}`}
          className={`rounded-xl`}
        ></Image>

        <div className={
        `w-full h-full bg-black/30 absolute top-0 rounded-lg
        flex flex-col justify-center items-center ${openSans.className} text-[16px]
        space-y-[30px] opacity-0 hover:opacity-100 transition-all duration-100
        ease-in-out`
        }>
          <p className={
          `w-[100px] h-[50px] flex justify-center items-center border-[1px] border-[#4d3bc6]
          rounded-lg font-normal text-white hover:scale-[1.2] hover:font-semibold
          transition-all duration-300 ease-in-out hover:bg-[#4d3bc6] hover:border-none
          `
          }>Mua ngay</p>
          <p className={
          `w-[170px] h-[50px] flex justify-center items-center border-[1px] border-[#4d3bc6]
          rounded-lg font-normal text-white hover:scale-[1.2] hover:font-semibold
          transition-all duration-300 ease-in-out hover:bg-[#4d3bc6] hover:border-none
          `
          }>Thêm vào giỏ hàng</p>
        </div>
      </div>
      <div
        className={`${openSans.className}
        text-[14px] text-[#95989d]
        mt-[9px]`}
      >
        <p>{type}</p>
      </div>
      <div className={`${ebGaramond.className} w-[250px] h-auto mt-[5px]`}>
        <p className={`font-bold text-[24px] leading-[35px] text-[#25272d]`}>
          {bookName}
        </p>
        <p className={`${openSans.className} text-[#62666c]`}>{author}</p>
      </div>
      <div
        className={`${openSans.className} mt-[5px] text-[#565a61] font-bold flex flex-row gap-x-[5px] justify-start`}
      >
        {originPrice && (
          <p className={`text-[#a4a7ac] line-through`}>{originPrice}</p>
        )}
        <p>{price}</p>
      </div>
    </div>
  );
};

export default BookPlaceHolder;
