import Image from "next/image";
import { Baloo_Paaji_2 } from "next/font/google";
import { EB_Garamond } from "next/font/google";
import ReadMore from "./ReadMore";

const balooPaaji2 = Baloo_Paaji_2({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const Biography = () => {
  return (
    <div
      className="flex
    flex-col lg:flex-row
    gap-x-[100px]"
    >
      <div className={`w-[400px] lg:w-[500px]`}>
        <Image
          src="/author/nguyen-nhat-anh.jpg"
          width={400}
          height={0}
          alt="Nguyễn Nhật Ánh"
          className={`rounded-xl w-full h-auto`}
        ></Image>
      </div>
      <div>
        <div className={`${balooPaaji2.className} mt-[30px]`}>
          <p
            className={`font-semibold
                text-[20px]
                text-[#5f4ecb]`}
          >
            TÁC GIẢ
          </p>
        </div>
        <div
          className={`${ebGaramond.className}
        font-bold text-[40px] text-[#25272d]`}
        >
          <p>Nguyễn Nhật Ánh</p>
        </div>
        <div
          className={`w-[400px] space-y-[20px] mt-[20px]
            text-[#62666c]`}
        >
          <p>
            Nguyễn Nhật Ánh (sinh ngày 7 tháng 5 năm 1955) là một nam nhà văn
            người Việt Nam. Được xem là một trong những nhà văn hiện đại xuất
            sắc nhất Việt Nam hiện nay, ông được biết đến qua nhiều tác phẩm văn
            học về đề tài tuổi trẻ. Nhiều tác phẩm của ông được độc giả và giới
            chuyên môn đánh giá cao, đa số đều đã được chuyển thể thành phim.
          </p>
        </div>
        <div className="relative">
          <ReadMore />
        </div>
      </div>
    </div>
  );
};

export default Biography;
