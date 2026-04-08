import Image from "next/image";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["vietnamese", "latin"],
});

const Adwards = () => {
  return (
    <div className={`${openSans.className}`}>
      <div
        className={`flex
      flex-col lg:flex-row
      lg:justify-center lg:items-center lg:gap-x-[60px]`}
      >
        <div className={`w-[250px] h-auto mb-[45px]`}>
          <Image
            src="/ultra.svg"
            width={90}
            height={0}
            alt="Ultra Prestigous"
          ></Image>
          <p className={`font-bold text-[#25272d] mt-[20px]`}>
            Best Author Awards 2012
          </p>
          <p className={`text-[#62666c] mt-[6px]`}>
            Arcu pellentesque nisi consectetur netus aenean metus sit mattis sit
            sed.
          </p>
        </div>
        <div className={`w-[250px] h-auto mb-[45px]`}>
          <Image
            src="/mega.svg"
            width={100}
            height={0}
            alt="Mega Standard"
          ></Image>
          <p className={`font-bold text-[#25272d] mt-[20px]`}>
            World's #1 Best-selling Book
          </p>
          <p className={`text-[#62666c] mt-[6px]`}>
            Diam nibh non in enim nunc suscipit risus, adipiscing aenean quisque
            viverra.
          </p>
        </div>
        <div className={`w-[250px] h-auto mb-[45px]`}>
          <Image
            src="/hyper-best.svg"
            width={100}
            height={0}
            alt="Hyper Best"
          ></Image>
          <p className={`font-bold text-[#25272d] mt-[20px]`}>
            NYT Best-selling Author 2014
          </p>
          <p className={`text-[#62666c] mt-[6px]`}>
            Urna donec dolor bibendum lectus arcu purus eget nisl, ut nisl
            vitae.
          </p>
        </div>
        <div className={`w-[250px] h-auto mb-[45px]`}>
          <Image
            src="/ultimate-winer.svg"
            width={60}
            height={0}
            alt="Ultimate Winer"
          ></Image>
          <p className={`font-bold text-[#25272d] mt-[20px]`}>
            Best Author Awards 2018
          </p>
          <p className={`text-[#62666c] mt-[6px]`}>
            Morbi odio sodales et facilisis mi nibh fringilla quis risus
            ultricies facilisis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Adwards;
