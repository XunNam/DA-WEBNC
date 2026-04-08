import { Metadata } from "next";
import AuthorPlaceHolder from "./components/authorPlaceHolder";
import { EB_Garamond } from "next/font/google";

const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

export const metadata: Metadata = {
  title: "Bookstore | Tác giả",
  description: "Tác giả sách",
};

export default function AuthorsPage() {
  return (
    <div className={`flex flex-col justify-center items-center`}>
      <div
        className={`${ebGaramond.className}
      font-bold text-[40px] my-[50px]`}
      >
        <p>Tác giả</p>
      </div>
      <div
        className={`flex flex-col justify-center items-center 2xl:flex-row 2xl:gap-x-[50px]`}
      >
        <div
          className={`flex flex-col md:flex-row justify-center items-center gap-x-[50px]`}
        >
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/nguyen-nhat-anh.jpg"
              name="Nguyễn Nhật Ánh"
              page="/authorsPage/nguyenNhatAnh"
            />
          </div>
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/ngo-tat-to.jpg"
              name="Ngô Tất Tố"
              page="/authorsPage/ngoTatTo"
            />
          </div>
        </div>
        <div
          className={`flex flex-col md:flex-row justify-center items-center gap-x-[50px]`}
        >
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/kim-lan.jpg"
              name="Kim Lân"
              page="/authorsPage/kimLan"
            />
          </div>
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/nam-cao.jpg"
              name="Nam Cao"
              page="/authorsPage/namCao"
            />
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col justify-center items-center 2xl:flex-row 2xl:gap-x-[50px] 2xl:mt-[200px]`}
      >
        <div
          className={`flex flex-col md:flex-row justify-center items-center gap-x-[50px]`}
        >
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/nguyen-du.jpg"
              name="Nguyễn Du"
              page="/authorsPage/nguyenDu"
            />
          </div>
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/vu-trong-phung.jpg"
              name="Vũ Trọng Phụng"
              page="/authorsPage/vuTrongPhung"
            />
          </div>
        </div>
        <div
          className={`flex flex-col md:flex-row justify-center items-center gap-x-[50px]`}
        >
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/nguyen-ngoc-tu.jpg"
              name="Nguyễn Ngọc Tư"
              page="/authorsPage/nguyenNgocTu"
            />
          </div>
          <div className={`mb-[150px] 2xl:mb-0`}>
            <AuthorPlaceHolder
              image="/author/nguyen-tuan.jpg"
              name="Nguyễn Tuân"
              page="/authorsPage/nguyenTuan"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
