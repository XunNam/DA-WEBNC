import { EB_Garamond } from "next/font/google";
import Image from "next/image";
import AuthorReadMore from "./authorReadSample";

const ebGaramond = EB_Garamond({
    weight: ["400", "500", "600", "700", "800"],
    subsets: ["vietnamese", "latin"],
  });

type AuthorPlaceHolder = {
    image: string,
    name: string,
    page: string
}


const AuthorPlaceHolder = ({ image, name, page }: AuthorPlaceHolder) => {
    
    
    return (
        <div className={`flex flex-col justify-center items-center relative`}>
            <div>
                <Image
                src={image}
                width={300}
                height={0}
                alt={`Tác giả ${name}`}
                className={`rounded-xl`}
                ></Image>
            </div>
            <div className={`${ebGaramond.className}`}>
                <p className={`font-bold text-[30px]
                text-[#25272d] mt-[12px]`}>
                    {name}
                </p>
            </div>
            <div>
                <AuthorReadMore
                href={page}
                />
            </div>
        </div>
    )
}

export default AuthorPlaceHolder