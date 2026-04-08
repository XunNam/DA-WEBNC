import Link from "next/link";

type AuthorPlaceHolder = {
  href: string
}

const AuthorReadMore = ({ href }: AuthorPlaceHolder) => {
  return (
    <Link
      href={href}
      className={`px-[25px] py-[12px]
    inline-flex rounded-md absolute
    hover:scale-[1.1] my-[30px]
    border-[1px] border-[#4d3bc6]
    text-[#4d3bc6] hover:bg-[#4d3bc6]
    hover:border-none hover:text-white
    transition-all duration-200 ease-in-out
    right-[90px] -bottom-[100px]`}
    >
      Đọc Thêm
    </Link>
  );
};

export default AuthorReadMore;
