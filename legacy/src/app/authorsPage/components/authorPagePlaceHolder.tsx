import Image from "next/image";
import { Crimson_Pro } from "next/font/google";
import { Varela_Round } from "next/font/google";
import AuthorPageReadMore from "./authorPageReadMore";

const varelaRound = Varela_Round({
  weight: ["400"],
  subsets: ["vietnamese", "latin"],
});

const crimsonPro = Crimson_Pro({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
});

type AuthorPagePlaceHolder = {
  image: string;
  name: string;
  dateOfBrith: string;
  text1: string;
  text2?: string;
  text3?: string;
  text4?: string;
  readMore: string;
  linkExternal: string;
};

const AuthorPagePlaceHolder = ({
  image,
  name,
  dateOfBrith,
  text1,
  text2,
  text3,
  text4,
  readMore,
  linkExternal,
}: AuthorPagePlaceHolder) => {
  return (
    <div>
      <div
        className={`${crimsonPro.className}
      text-[40px] font-bold text-[#25272d]
      mb-[40px] lg:mb-[60px] flex justify-center items-center`}
      >
        <p>Tiểu sử tác giả</p>
      </div>
      <div
        className={`w-full h-auto flex flex-col
        justify-center items-center py-[20px]
        lg:flex-row lg:items-start lg:gap-x-[40px]`}
      >
        <div
          className={`${crimsonPro.className} flex flex-col justify-center items-center lg:w-1/3`}
        >
          <div
            className={`flex flex-col justify-center items-center
          lg:justify-start lg:items-start`}
          >
            <div>
              <Image
                src={image}
                width={300}
                height={0}
                alt={`Tác giả ${name}`}
                className={`rounded-full`}
              ></Image>
            </div>
            <div
              className={`mt-[30px] flex flex-col justify-center items-center lg:justify-start lg:items-start`}
            >
              <p
                className={`font-bold text-[40px]
                        text-[#25272d]`}
              >
                {name}
              </p>
              <p className={`text-[#62666c]`}>{dateOfBrith}</p>
            </div>
          </div>
        </div>
        <div className={`lg:w-2/3`}>
          <div
            className={`${varelaRound.className} text-[16px] mt-[40px] lg:mt-0 text-justify`}
          >
            <p>{text1}</p>
            {text2 && <p className={`mt-[20px]`}>{text2}</p>}
            {text3 && <p className={`mt-[20px]`}>{text3}</p>}
            {text4 && <p className={`mt-[20px]`}>{text4}</p>}
          </div>
          <div className={`flex flex-row justify-center mt-[30px]`}>
            <AuthorPageReadMore link={linkExternal} text={readMore} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPagePlaceHolder;
